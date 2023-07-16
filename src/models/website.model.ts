import { Product } from './product.model';
import { IResizer } from './utils.model';
import { CMSCollection } from './cms.model';
import { IObjectMap } from 'src/services/ParserHelper';
import { getId, initBody } from 'src/services/helper';

export interface WebsiteModel {
  Saved?: ElementModel[];
  Id?: number;
  WebsiteId: string;
  Slug: string;
  Url: string;
  Title?: string;
  Name?: string;
  Status: string;
  CreatedBy: string;
  OwnerId: string;
  Pages: PageModel[];
  Sections: ElementModel[];
  Imports: WebsiteImport[];
  CMSCollections?: CMSCollection[];
  Theme: WebsiteTheme;
  Page?: PageModel;
  Element?: ElementModel;
  Body?: ElementModel;
  ElementToPaste?: ElementModel;
  Elements?: ElementModel[];
  SelectedElements?: ElementModel[];
  GlobalElements?: ElementModel[];
  Components?: ElementModel[];
  ShowPages?: boolean;
  ShowComponents?: boolean;
  ShowAssets?: boolean;
  ShowLayers?: boolean;
  Editing?: boolean;
  Device?: string;
  Cover?: string;
  Mode?: string;
  Metadata?: IWebsiteMetadata;
}

export interface IWebsiteMetadata {
  ElementToPasteId?: string;
  ElementToPastePageId?: string;
}
export interface PageModel {
  Id?: number;
  OwnerId: string;
  CreatedBy: string;
  Status: string;
  PageId: string;
  WebsiteId: string;
  PageName: string;
  IsHome?: string;
  ShowMenu?: boolean;
  Url: string;
  OrderNo: number;
  PcStyles: any;
  TabStyles: any;
  PhoneStyles: any;
  // Sections: ElementModel[];
  Body: ElementModel;
  Classes?: string[];
}

export interface ElementModel {
  TempTable?: CMSCollection;
  Id?: number;
  ElementId?: string;
  DataItem?: any; // Holds cms data
  OldId?: string;
  ParentId?: string;
  OrderNo?: number;
  Name: string;
  SelectorName: string[];
  Type: string;
  Data: any;
  PcStyles: any;
  TabStyles: any;
  PhoneStyles: any;
  Children: ElementModel[];
  PlaceHolder?: string;
  OnHover?: any;
  Link: string;
  ExternalLink?: string;
  FormId: string;
  Events: EventModel[];
  Rules?: RuleModel;
  MouseOver?: boolean;
  Editing?: boolean;
  IsSelectedClass?: string[];
  WebsiteId?: string;
  PageId?: string;
  MapId?: string;
  Status: string;
  CreatedBy: string;
  Product?: Product;
  State?: string;
  Editable?: boolean;
  Draggable?: boolean;
  IsDynamicData?: boolean;
  IsDynamicDataList?: boolean;
  Resizer?: IResizer;
  TempType?: string;
  Mappings?: IMapping;
  Category?: string;
  Cover?: string;
  Label?: string;
  IsGlobalParent?: string;
  Metadata?: MetadataModel;
  States?: StateModel[];
  Keys?: IObjectMap[];
  Utils?: any;
  TempData?: string;
}

export interface MetadataModel {
  IconType?: string;
  IconClass?: string;
  StyleSaved?: string;
  StyleName?: string;
  Data?: IData[];
  Format?: string;
  Currency?: string;
  Postion?: {
    pw: number;
    ph: number;
    t: number;
    b: number;
    l: number;
    r: number;
  };
}
export interface IData {
  Type: 'string' | 'dynamic';
  Value: string;
  Selected: boolean;
  TableIds?: { Name: string; Id: string }[];
  Operation?: {
    Operation: string;
    Column: string;
    Label: string;
    TypeOfSearch: 'List of items' | 'Single item' | 'Count' | 'Calculate';
  };
}
export interface StateModel {
  Name: string;
  Type: string;
  PcStyles: any;
  TabStyles: any;
  PhoneStyles: any;
}
export interface EventModel {
  Id?: string;
  Name?: string;
  CollectionId?: string;
  CollectionItemId?: string;
  Type: string;
  TargetId: string;
  TargetName?: string;
  Trigger?: string;
  Slug?: string;
  Link?: string;
  DbLink?: string;
  TableName?: string;
  TableId?: string;
  DataMapping?: EventDataMapping[];
  Then?: EventModel;
  Params?: IEventParam[];
  Filters?: IEventFilter[];
  OutComes?: IEventOutCome[];
}

export interface IEventOutCome {
  Id: string;
  Name: string;
  ReturnType: string;
  Event?: EventModel;
}

export interface IEventOptions {
  Id: string;
  Name: string;
  Type: string;
}
export interface IEventFilter {
  Key: string;
  Value: string;
}
export interface IEventParam {
  Name: string;
  GetValueFrom: 'Enter manually' | 'Form input' | 'Page element';
  Value: string;
  Type: string;
  Id: string;
  SelectedForUpdate?: string;
  GetValueFromOptions?: string[];
  Items?: IEventParam[];
  Options?: IEventOptions[];
  IsList?: string;
  IsCollection: string;
  Operation?: string;
  Params?: IEventParam[];
}
export interface IEventTypes {
  Id: string;
  Name: string;
  Items: IEventParam[];
  Options: IEventOptions[];
  OutComes?: IEventOutCome[];
}
export interface EventDataMapping {
  ColumnId: string;
  ColumnName: string;
  ElementId: string;
  DataType: string;
  ElementName: string;
}
export interface WebsiteImport {
  Id: number;
  Type: string;
  Name: string;
  Url: string;
  Variations: number[];
}
export interface WebsiteTheme {
  Groups: IThemeGroup[];
}
export interface RuleModel {
  VissibleToLoggedIn: boolean;
  VissibleToLoggedOut: boolean;
  Role?: string;
}
export interface IThemeGroup {
  Group: string;
  Items: IValueId[];
}
export interface IMapping {
  Id: string;
  Type: string;
  Function: string;
  Format: string;
  Status: string;
  CreateDate: string;
  IsArray: boolean;
}
export interface IValueId {
  Value: string;
  Id: string;
}

export const initMapping = (): IMapping => {
  return {
    CreateDate: `${new Date()}`,
    Format: '',
    Function: '',
    Id: getId('map'),
    IsArray: false,
    Status: 'Active',
    Type: '',
  };
};
export const initPage = (webId = ''): PageModel => {
  return {
    PageId: getId('page'),
    WebsiteId: webId,
    PageName: '',
    Url: '',
    IsHome: 'No',
    OrderNo: 1,
    Id: 0,
    // Sections: [],
    PcStyles: {},
    TabStyles: {},
    PhoneStyles: {},
    Body: initBody(),
    OwnerId: 'admin',
    CreatedBy: 'admin',
    Status: 'active',
  };
};
export const initState = (name: string, type = ''): StateModel => {
  return {
    PcStyles: {},
    TabStyles: {},
    PhoneStyles: {},
    Name: name,
    Type: type,
  };
};
