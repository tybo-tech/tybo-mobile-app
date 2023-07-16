import { CMSCollection } from 'src/models/cms.model';
import {
  ElementModel,
  IEventOptions,
  IEventParam,
  IEventTypes,
  WebsiteModel,
} from 'src/models/website.model';

export const initEvents = (
  pages: IEventOptions[] = [],
  collections: string[] = [],
  elements: IEventOptions[] = []
): IEventTypes[] => {
  return [
    {
      Id: EVENT_TYPES.NavigateToPage.Id,
      Name: EVENT_TYPES.NavigateToPage.Name,
      Options: [],
      Items: [
        {
          Id: 'select-page',
          Name: 'Select Page',
          Items: [],
          Options: pages,
          Type: 'select',
          Value: '',
          GetValueFrom: 'Enter manually',
          GetValueFromOptions: [],
          IsCollection: 'no',
        },
      ],
    },
    {
      Id: 'open-link',
      Name: 'Open Link',
      Items: [
        {
          Id: 'link-name',
          Name: 'Enter the link',
          Type: 'text-box',
          Items: [],
          Options: [],
          Value: '',
          GetValueFrom: 'Enter manually',
          GetValueFromOptions: ['Enter manually', 'User input'],
          IsCollection: 'no',
        },
      ],
      Options: [],
    },
    {
      Id: EVENT_TYPES.GetCollectionItem.Id,
      Name: EVENT_TYPES.GetCollectionItem.Name,
      Items: [],
      Options: [],
      OutComes: [
        {
          Id: EVENT_OUTCOMES.found,
          Name: 'Item found',
          ReturnType: '',
        },
        {
          Id: EVENT_OUTCOMES.notFound,
          Name: 'Item not found',
          ReturnType: 'Nothing',
        },
      ],
    },
    {
      Id: EVENT_TYPES.CreateCollectionItem.Id,
      Name: EVENT_TYPES.CreateCollectionItem.Name,
      Items: [],
      Options: [],
      OutComes: [
        {
          Id: EVENT_OUTCOMES.created,
          Name: 'Created item',
          ReturnType: '',
        },
      ],
    },
    {
      Id: EVENT_TYPES.UpdateCollectionItem.Id,
      Name: EVENT_TYPES.UpdateCollectionItem.Name,
      Items: [],
      Options: [],
      OutComes: [
        {
          Id: EVENT_OUTCOMES.created,
          Name: 'Edited item',
          ReturnType: '',
        },
      ],
    },
    {
      Id: EVENT_TYPES.DeleteCollectionItem.Id,
      Name: EVENT_TYPES.DeleteCollectionItem.Name,
      Items: [],
      Options: [],
      OutComes: [
        {
          Id: EVENT_OUTCOMES.deleted,
          Name: 'Item was deleted.',
          ReturnType: 'string',
        },
      ],
    },
    {
      Id: EVENT_TYPES.Show.Id,
      Name: EVENT_TYPES.Show.Name,
      Items: [
        {
          Id: 'select-element',
          Name: 'Select element',
          Items: [],
          Options: elements,
          Type: 'select',
          Value: '',
          GetValueFrom: 'Enter manually',
          GetValueFromOptions: ['Enter manually', 'User input'],
          IsCollection: 'no',
        },
      ],
      Options: [],
    },
    {
      Id: EVENT_TYPES.Hide.Id,
      Name: EVENT_TYPES.Hide.Name,
      Items: [
        {
          Id: 'select-element',
          Name: 'Select element',
          Items: [],
          Options: elements,
          Type: 'select',
          Value: '',
          GetValueFrom: 'Enter manually',
          GetValueFromOptions: ['Enter manually', 'User input'],
          IsCollection: 'no',
        },
      ],
      Options: [],
    },
    {
      Id: 'toggle',
      Name: 'Toggle',
      Items: [
        {
          Id: 'select-element',
          Name: 'Select element',
          Items: [],
          Options: elements,
          Type: 'select',
          Value: '',
          GetValueFrom: 'Enter manually',
          GetValueFromOptions: ['Enter manually', 'User input'],
          IsCollection: 'no',
        },
      ],
      Options: [],
    },
    {
      Id: EVENT_TYPES.SendEmail.Id,
      Name: EVENT_TYPES.SendEmail.Name,
      Items: [
        {
          Id: 'email-subject',
          Name: 'Email Subject',
          Value: '',
          Items: [],
          Type: 'input',
          GetValueFrom: 'Enter manually',
          GetValueFromOptions: ['Enter manually', 'User input'],
          IsCollection: 'no',
        },
        {
          Id: 'recipient-name',
          Name: 'Recipient name',
          Value: '',
          Items: [],
          Type: 'input',
          GetValueFrom: 'Enter manually',
          GetValueFromOptions: ['Enter manually', 'User input'],
          IsCollection: 'no',
        },
        {
          Id: 'recipient-email',
          Name: 'Recipient email',
          Items: [],
          Type: 'input',
          Value: '',
          GetValueFrom: 'Enter manually',
          GetValueFromOptions: ['Enter manually', 'User input'],
          IsCollection: 'no',
        },
        {
          Id: 'sender-name',
          Name: 'Sender name',
          Items: [],
          Type: 'input',
          Value: '',
          GetValueFrom: 'Enter manually',
          GetValueFromOptions: ['Enter manually', 'User input'],
          IsCollection: 'no',
        },
        {
          Id: 'sender-email',
          Name: 'Sender email',
          Items: [],
          Type: 'input',
          Value: '',
          GetValueFrom: 'Enter manually',
          GetValueFromOptions: ['Enter manually', 'User input'],
          IsCollection: 'no',
        },
        {
          Id: 'message',
          Name: 'Message',
          Type: 'input',
          Value: '',
          Items: [],
          GetValueFrom: 'Enter manually',
          GetValueFromOptions: ['Enter manually', 'User input'],
          IsCollection: 'no',
        },
      ],
      Options: [],
    },
    { Id: 'add-to-cart', Name: 'Add to cart', Items: [], Options: [] },
    { Id: 'sign-up', Name: 'Sign up user', Items: [], Options: [] },
    { Id: 'login-up', Name: 'Login user', Items: [], Options: [] },
  ];
};

export const EVENT_OUTCOMES = {
  created: 'created',
  updated: 'updated',
  found: 'found',
  notFound: 'not-found',
  deleted: 'Item Deleted',
};
export const EVENT_TYPES = {
  CreateCollectionItem: {
    Id: 'create-collection-item',
    Name: 'Create collection item',
  },
  GetCollectionItem: {
    Id: 'get-collection-item',
    Name: 'Get collection item',
  },
  UpdateCollectionItem: {
    Id: 'update-collection-item',
    Name: 'Update collection item',
  },
  DeleteCollectionItem: {
    Id: 'delete-collection-item',
    Name: 'Delete current item',
  },
  Show: { Id: 'show', Name: 'Show Element' },
  SendEmail: { Id: 'send-email', Name: 'Send Email' },
  Hide: { Id: 'hide', Name: 'Hide Element' },
  Togle: { Id: 'toggle', Name: 'Toggle Element' },
  NavigateToPage: { Id: 'navigate', Name: 'Navigate to page' },
  OpenLink: { Id: 'open-link', Name: 'Navigate to page' },
};
export const TRIGGERS = ['Click', 'Mouse Over'];
export const CMS_FILTERS = [
  "Current user's",
  'Url item Id',
  'Active',
  'Cart',
  '1000',
  'Found',
  'Not found',
];
export const EVENT_VALUE_SOURCE = {
  Manually: 'Enter manually',
  FormInput: 'Form input',
  PageElement: 'Page element',
};
export const EVENT_VALUE_SOURCES = [
  EVENT_VALUE_SOURCE.Manually,
  EVENT_VALUE_SOURCE.FormInput,
  EVENT_VALUE_SOURCE.PageElement,
];
export function findEventParam(meta: IEventParam[], id: string) {
  return meta.find((x) => x.Id === id)?.Value || '';
}
export function initIEventParam(
  name: string,
  id: string,
  type: string,
  website: WebsiteModel,
  IsArray: string
): IEventParam {
  return {
    GetValueFrom: 'Enter manually',
    Value: 'Test',
    Name: name,
    IsList: IsArray,
    Id: id,
    SelectedForUpdate: 'no',
    Type: type,
    IsCollection: getEventParamType(type, website),
  };
}

function getEventParamType(type: string, website: WebsiteModel): string {
  const col = website.CMSCollections?.find((x) => x.Name === type);
  if (col) {
    return 'yes';
  }
  return 'no';
}
export const  EVENT_OPERATIONS = {
  addItem : 'add-item'
}

export function initIEventParamForCollection(
  table: CMSCollection,
  website: WebsiteModel
): IEventParam[] {
  const params: IEventParam[] = [];
  if (!table || !table.Columns.length) return params;
  table.Columns.forEach((col) => {
    const param = initIEventParam(
      col.Name,
      col.Id,
      col.Type,
      website,
      col.IsArray
    );
    params.push(param);
  });
  return params;
}
