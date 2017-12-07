import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'usercategory'})
export class UserCategoryPipe implements PipeTransform {
  transform(securityRole: string): string {
    if(!securityRole) return securityRole;
    let firstLetter = securityRole.substring(0);
    return firstLetter == 'I'?'Internal':'External'
  }
}


@Pipe({name: 'securityrole'})
export class UserSecurityRolePipe implements PipeTransform {
  transform(securityRole: string): string {
    if(!securityRole) return securityRole;
    switch(securityRole) {
      case "I_Admin_OPS_MGR" : return 'Admin';
      case 'INT_AGT_EMA': return "Agent"
      case 'INT_AGT_EMM': return "Agent"
      case 'EXT_BROKER': return "Broker"
      case 'EXT_CA_PO': return "Customer Admin"
      case 'EXT_CA_PM': return "Customer Admin"
      case 'INT_READ_ONLY': return "Read-Only"
      case 'INT_AGT_OPREP': return "Agent"
      case 'EXT_READ_ONLY': return "External Read-Only"
      case 'EXT_CUS_ASC': return "Customer Associate"
      case 'EXT_BRK_ASC': return "Broker Associate"
      default: securityRole;
    }
  }
}



@Pipe({name: 'usertype'})
export class UserTypePipe implements PipeTransform {
  transform(securityRole: string): string {
    if(!securityRole) return securityRole;
    switch(securityRole) {
      case 'INT_AGT_EMA': return "EMA"
      case 'INT_AGT_EMM': return "EMM"
      case 'EXT_CA_PO': return "Property Owner"
      case 'EXT_CA_PM': return "Property Manager"
      case 'INT_AGT_OPREP': return "Operations Representative"
      default: securityRole;
    }
  }
}


@Pipe({name: 'associatetype'})
export class UserAssociatePipe implements PipeTransform {
  transform(securityRole: string): string {
    console.log("securityRole -====" +securityRole);
    if(!securityRole) return securityRole;
    switch(securityRole) {
      case 'E_Broker_BRK_ADM': return "Broker Associate"
      case 'E_Customer Admin_PO': return "Customer Associate"
      case 'E_Customer Admin_PM': return "Customer Associate"
      default: securityRole;
    }
  }
}
