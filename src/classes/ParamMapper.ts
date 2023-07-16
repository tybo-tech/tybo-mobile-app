
import { CMSCollection, CMSData, initCMSData } from 'src/models/cms.model';
import {
  EventModel,
  IEventParam,
  WebsiteModel,
} from 'src/models/website.model';
import { loadSession } from 'src/services/constants';
import { EVENT_OPERATIONS, EVENT_VALUE_SOURCE } from 'src/services/event-helper';
import { getId, getElementById } from 'src/services/helper';

export class ParamMapper {
  fileds: IEventParam[];
  table: CMSCollection;
  website: WebsiteModel;
  event: EventModel;
  Records: CMSData[];
  public constructor(
    filedsToUpdate: IEventParam[],
    table: CMSCollection,
    website: WebsiteModel,
    event: EventModel
  ) {
    this.fileds = filedsToUpdate;
    this.table = table;
    this.website = website;
    this.event = event;
    this.Records = [];
    this.Map();
  }

  Map() {
    this.fileds.forEach((field) => {
      if (
        field.IsCollection === 'yes' &&
        field.Operation === EVENT_OPERATIONS.addItem
      ) {
        const table = this.website.CMSCollections?.find(
          (x) => x.Name === field.Type
        );
        if (table && field.Params) {
          this.Records = this.InitRecord(table, field.Params);
        }
      }
      if (field.IsList === 'yes') {
      }
    });
  }

  InitRecord(table: CMSCollection, params: IEventParam[]): CMSData[] {
    if (!table || !table.Columns?.length) return [];
    const recordId = getId('record');
    const record: CMSData[] = [];
    table.Columns.forEach((column) => {
      const recordItem: CMSData = initCMSData(
        recordId,
        table?.WebsiteId || '',
        'tybo-editor',
        column.Id,
        column.Name,
        '',
        column.TableId
      );
      this.AssignValue(recordItem, params);
      record.push(recordItem);
    });
    if (record.length) {
      record.forEach((x) => {
        x.ColumnType =
          table?.Columns.find((v) => v.Id === x.ColumnId)?.Type || '';
      });
    }
    return record;
  }

  AssignValue(recordItem: CMSData, params: IEventParam[]) {
    const check = params.find((x) => x.Name === recordItem.ColumnName);
    recordItem.Value = check?.Value || '';
    if (check && check.GetValueFrom === EVENT_VALUE_SOURCE.Manually) {
      recordItem.Value = check.Value || '';
    }
    if (
      check &&
      (check.GetValueFrom === EVENT_VALUE_SOURCE.FormInput ||
        check.GetValueFrom === EVENT_VALUE_SOURCE.PageElement)
    ) {
      const element = getElementById(
        check.Value,
        this.website?.Page?.Body.Children || []
      );
      recordItem.Value = element?.Data || '';
    }
    recordItem.CurrentUserId = loadSession().CurrentUserId;
    return recordItem;
  }
}
