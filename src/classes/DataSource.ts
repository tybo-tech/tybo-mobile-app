import { IData, WebsiteModel } from 'src/models/website.model';
import { CmsClass } from './CmsClass';
import { ELEMENT_TYPES } from 'src/services/helper';

export class WebsiteDataSource {
  Collections: ICollection[] = [];
  Collection?: ICollection;
  private website: WebsiteModel;
  IsCollectionListContainer: boolean;
  public constructor(website: WebsiteModel) {
    this.Collections = [];
    this.website = website;
    this.IsCollectionListContainer = false;
    this.Init();
  }
  SelectCollection(collection: ICollection, idata: IData) {
    this.Collections.map((x) => (x.Selected = false));
    collection.Selected = true;
    this.Collection = collection;
    idata.Value = collection.Name;
    if (!idata.TableIds) idata.TableIds = [];
    idata.TableIds.push({ Id: collection.Id, Name: collection.Name });
    if (idata.TableIds.length) {
      idata.Value = '';
      idata.TableIds.forEach((x) => {
        idata.Value += `${x.Name}'s `;
      });
    }
    if (collection.IsArray) {
      const cmsClass = new CmsClass(this.website);
      cmsClass.GetTable(this.Collection.Id);
      const table = cmsClass.Table;
      const keys = cmsClass.Keys;
      console.log({ Collection: this.Collection, Table: table, Keys: keys });
      if (keys?.length) {
        this.Collection.Operations = [];
        keys
          .filter((x) => x.Type === 'number')
          .forEach((key) => {
            this.Collection?.Operations?.push({
              Operation: 'Total',
              Column: key.Key,
              TableId:table?.Id || '',
              Label: `Total of ${key.Key}`,
              TypeOfSearch: 'Calculate',
            });
          });
      }
    }
  }
  private Init() {
    if (this.website && this.website.Element) {
      this.IsCollectionListContainer =
        this.website.Element.Type === ELEMENT_TYPES.dataList ||
        this.website.Element.Type === ELEMENT_TYPES.dataItem;
      this.Collections =
        this.website?.CMSCollections?.map((x) => {
          return {
            Id: x.Id,
            Name: x.Name,
            Selected: false,
            IsArray: false,
          };
        }) || [];
      // if (this.IsCollectionListContainer) {
      this.website?.CMSCollections?.forEach((tbl) => {
        tbl.Columns.forEach((column) => {
          const check = this.website?.CMSCollections?.find(
            (t) => t.Name === column.Name
          );
          if (check) {
            this.Collections.push({
              Id: `${tbl.Id},${check.Id}`,
              Name: `${tbl.Name}'s ${check.Name}`,
              Selected: false,
              IsArray: column.IsArray.toLocaleLowerCase() === 'yes',
            });
          }
        });
      });
      // }
    }
  }
}

export interface ICollection {
  Name: string;
  Id: string;
  Selected: boolean;
  IsArray: boolean;
  Operations?: {
    Operation: string;
    Column: string;
    TableId: string;
    Label: string;
    TypeOfSearch: 'List of items' | 'Single item' | 'Count' | 'Calculate';
  }[];
}
