export class EmployeeModel {
  Code: string;
  Name: string;
  Phone: string;
  Email: string;
  Address: string;

  constructor(properties: { Code?: string, Name: string, Phone?: string, Email?: string, Address?: string }) {
    this.Code = properties.Code;
    this.Name = properties.Name;
    this.Phone = properties.Phone;
    this.Email = properties.Email;
    this.Address = properties.Address;
  }

}
