
const TEST_PROJECT_ID_ = '47074253'
const TEST_LABEL_ID_ = LABELS_['Closed']

const test_misc = function() {
  const a = getInvitation(TEST_PROJECT_ID_)
  // console.log(a)
  debugger
}

function test_getLabels() {
  const labels = getLabels(TEST_PROJECT_ID_)
  console.log(labels)
  debugger
}

function test_deleteLabel() {
  const labels = deleteLabel(TEST_PROJECT_ID_, TEST_LABEL_ID_)
  debugger
}

function test_createProject() {
  const project = createProject({
    name: 'AJRTest1804'
  })
  debugger
}

function test_updateProject() {
  const project = updateProject({
    id: TEST_PROJECT_ID_,
    firstName: 'Andrew',
    lastName: 'Test1804',
    homeAddress1: '1, The street',
    city: 'city1',
    email: 'a@b.com',
    phoneNumber: '111 11111'  
  })
  debugger
}
