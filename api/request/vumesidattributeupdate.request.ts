import {VUMEsidAttributeUpdateDO} from './../model/vumesidattributeupdatedo';

export class VUMEsidAttributeUpdateRequest{


  esidAttributeUpdateRequestList = new Array<VUMEsidAttributeUpdateDO>();
	strWebSubscriberId:string;
	strPropertyName:string;
	strLoggedInUserName:string;
  strCompanycode:string;
	strPortal:string;
}
