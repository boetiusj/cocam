
// Consts & Enums
// --------------

const SCRIPT_NAME = 'CompanyCam'
const SCRIPT_VERSION = 'v0.dev'

const DEFAULT_ROOT_URL_ = 'https://api.companycam.com/v2/'
const DEFAULT_API_TOKEN_ = '2s4Fk9-ZU1Q88FLRuxUQRo4BTkanCEKVo3GwcQhYKyo'
const NUMBER_OF_FETCH_RETRIES_ = 2

const LABELS_ = Object.freeze({
  'Closed'      : 1267587,
  'Complete'    : 1267584,
  'Estimated'   : 9339585,
  'In Progress' : 1267586,
  'Job Won!'    : 1267582,
  'Scheduled'   : 1267585
})

// API
// ---

function updateNotepad(projectId, message) {
  if (!projectId) throw new Error('Project ID required')
  if (!message) throw new Error('Message required')
  return API_.put(`projects/${projectId}/notpad`, {notepad: message})
}

function getInvitation(projectId) {
  if (!projectId) throw new Error('Project ID required')
  return API_.get(`projects/${projectId}/invitations`)
}

function getDocs(projectId) {
  if (!projectId) throw new Error('Project ID required')
  return API_.get(`projects/${projectId}/documents`)
}

function addDocs(projectId, docId) {
  if (!projectId) throw new Error('Project ID required')
  if (!docId) throw new Error('Dec ID required')
  const file = DriveApp.getFileById(docId)
  const encodedFile = Utilities.base64Encode(file.getBlob().getBytes)
  const payload = {
    document: {
      name: file.getName(),
      attachment: encodedFile
    }
  }
  return API_.post(`projects/${projectId}/documents`, payload)
}

function getProjects() {
  return API_.get('projects')
}

function createProject(params) {

  // estimateDate: parameter["lead[custom_fields][" + PLD_PEOPLE_CUSTOM_FIELD_ESTIMATE_DATE_STR + "]"],   

  const payload = {
    name: `${params.firstName} ${params.lastName}`,
    address: { 
      street_address_1 : params.homeAddress1,
      street_address_2 : params.homeAddress2 || '',
      city             : params.city || '',
      state            : params.state || '',
      postal_code      : params.postal_code || '',
    },
    primary_contact: {
      email: params.email,
      phone_number: params.phoneNumber, 
    } 
  }
  const project = API_.post(`projects`, payload)
  return project
}

function updateProject(params) {

  // estimateDate: parameter["lead[custom_fields][" + PLD_PEOPLE_CUSTOM_FIELD_ESTIMATE_DATE_STR + "]"],   

  const id = params.id
  if (!id) throw new Error('No project ID')

  const payload = {
    // id: id,
    name: `${params.firstName} ${params.lastName}`,
    address: { 
      street_address_1 : params.homeAddress1,
      street_address_2 : params.homeAddress2 || '',
      city             : params.city || '',
      state            : params.state || '',
      postal_code      : params.postal_code || '',
    },
    primary_contact: {
      name: `${params.firstName} ${params.lastName}`,
      email: params.email,
      phone_number: params.phoneNumber, 
    } 
  }
  const project = API_.put(`projects/${id}`, payload)
  return project
}

/**
 * @return {object} all the labels for this project
 */

function getLabels(projectId) {
  if (!projectId) throw new Error('Project ID required')
  return API_.get(`projects/${projectId}/labels`)
}

/**
 * @return {object} all the labels
 */

function deleteLabel(projectId, labelId) {
  if (!projectId) throw new Error('Project ID required')
  if (!labelId) throw new Error('Label ID required')
  return API_.hsDelete(`projects/${projectId}/labels/${labelId}`)
}

/**
 * @return {object} all the labels
 */

function addLabel(projectId, labelId) {
  if (!projectId) throw new Error('Project ID required')
  if (!labelId) throw new Error('Label ID required')
  return API_.post( 
    `projects/${projectId}/labels/`,
    {projects: {labels: [labelId]}})
}
