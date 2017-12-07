import {BaseRequest} from './base.request';

export class UpdatePMServiceStartStopRequest extends BaseRequest{

  constructor(){
      super();
  }
   strNONCSANODEGUIDList= new Array<string>(); //TO GET THE BMF PARTNER ID
	 bmfPartnerId:string;
	 requestorUserId:string;
	 custServiceVerifyInd:string;
	 date:string;
	 count:string;
	 priorityMoveflag:string;
	 esiId:string;		//!:
	 unitNumber:string;
	 streetNumber:string;
	 streetName:string;
	 city:string;
	 state:string;
	 zipCode:string;
	 bpNumber:string;	//!:
	 federalTaxId:string;
	 correspondenceLanguagePref:string;
	 bpBusinessName:string;
	 bpStreetNumber:string;
	 bpStreetName:string;
	 bpPoBox:string;
	 bpCity:string;
	 bpState:string;
	 bpZipCode:string;
	 relationshipId:string;

}
