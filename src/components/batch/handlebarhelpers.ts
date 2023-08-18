import { createJsonHandlebars } from "handlebars-a-la-json";


const placeHolderVcTemplate = `{
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],
    "type": ["VerifiableCredential", "AlumniCredential"],
    "name": "{{ name }}",
    "description": "{{ description }}",
    "issuanceDate": "{{ now }}",
    "credentialSubject": { "id": "{{ studentId }}" },
    "id": "{{ credentialId }}"
  }`;


const templateValuesDummy = {
    "name": "Jimbo Wales",
    "description": "test description",
    "issuanceDate": "08/18/2023",
    "studentId": "1231231231323",
    "credentialId": "234234234234",
}


const insertValuesIntoHandlebarsJsonTemplate = (template?: string, fieldValues?: any) => {
  const handlebars = createJsonHandlebars();
  // compile the template
  const _template = placeHolderVcTemplate; //dummy template
  const compiledTemplate = handlebars.compile(_template);

  // execute the template
  const data = templateValuesDummy // dummy data
  const obj = compiledTemplate(data);

  return obj; // return template with inserted values
};

export { insertValuesIntoHandlebarsJsonTemplate };
