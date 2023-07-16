import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CMSData, CMSCollection, CMSSearchModel, initCMSData } from "src/models/cms.model";
import { getId } from "./helper";

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.API_URL;
  }

  save(data: CMSData): Observable<CMSData> {
    return this.http.post<CMSData>(`${this.url}/cms/save.php`, data);
  }
  saveRange(data: CMSData[]): Observable<CMSData[]> {
    return this.http.post<CMSData[]>(`${this.url}/cms/save-range.php`, data);
  }

  getByRecordId(recordId: number): Observable<CMSData[]> {
    return this.http.get<CMSData[]>(
      `${this.url}/cms/get-record.php?RecordId=${recordId}`
    );
  }

  get(id: string) {
    return this.http.get<CMSData>(`${this.url}/cms/get.php?Id=${id}`);
  }

  delete(id: string) {
    return this.http.get<CMSData>(
      `${this.url}/cms/delete-record.php?RecordId=${id}`
    );
  }
  searchOne(table: CMSCollection) {
    return this.http.post<CMSData>(`${this.url}/cms/search.php`, table);
  }
  search(searchModel: CMSSearchModel) {
    return this.http.post<CMSData[]>(`${this.url}/cms/search.php`, searchModel);
  }
  getBySlug(data: { Slug: string; TableId: string; WebsiteId: string }) {
    return this.http.post<any>(`${this.url}/cms/get-by-slug.php`, data);
  }

  initData(table: CMSCollection) {
    if (!table || !table.Columns?.length) return;
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
}
