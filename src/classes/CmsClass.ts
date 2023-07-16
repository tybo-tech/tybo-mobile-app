import { CMSCollection } from 'src/models/cms.model';
import { WebsiteModel } from 'src/models/website.model';

export class CmsClass {
  private website: WebsiteModel;
  Table?: CMSCollection;
  Keys?: {Key: string, Type: string}[];
  public constructor(website: WebsiteModel) {
    this.website = website;
  }
  GetTable(id: string) {
    const ids = id.split(',');
    if (ids.length) {
      const table = this.website.CMSCollections?.find(
        (x) => x.Id === ids[ids.length - 1]
      );
      this.Table = table;
      // for (let i = ids.length - 2; i >= 0; i--) {
      //   const t = this.website.CMSCollections?.find(
      //     (x) => x.Id === ids[i]
      //   );
      //   if (t) {
      //   }
      // }
    } else {
      const table = this.website.CMSCollections?.find((x) => x.Id === id);
      this.Table = table;
    }
    if (this.Table) {
      this.Keys = this.Table.Columns.map((x) => {
        return {
          Key: x.Name,
          Type: x.Type
        }
      });
    }
  }
}
