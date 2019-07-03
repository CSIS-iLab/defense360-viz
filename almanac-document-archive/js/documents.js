window.addEventListener('message', function(event) {
  if (event.origin.indexOf('google') > -1) return
  console.log(event.data)
  var defense_system = event.data
    .replace(' | Defense360', '')
    .replace(/(_|%20)/g, ' ')

  callChart(defense_system)
})

function callChart(defense_system) {
  const SPREADSHEET_ID = '1AkJfA3GZbXsAlZIpsc34rXrYuYlVgzspa0ml9Xe7KpE'

  var chart
  gapi.load('client', function() {
    gapi.client
      .init({
        apiKey: 'AIzaSyA1ol27C1FVv-F6940xNXY-VImb5ZCE3JE',
        scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
        discoveryDocs: [
          'https://sheets.googleapis.com/$discovery/rest?version=v4'
        ]
      })
      .then(function() {
        gapi.client.sheets.spreadsheets.values
          .get({
            spreadsheetId: SPREADSHEET_ID,
            range: "'" + defense_system + "'!A:Z"
          })
          .then(function(sheet) {
            renderTable({ data: sheet.result.values })
          })
      })
  })
}

function renderTable(sheet) {
  console.log(
    sheet.data[0].map(function(c) {
      return { data: c }
    })
  )
  $('#documents').DataTable({
    data: sheet.data.map(function(r) {
      console.log(r)
      return [
        r[0],
        r[1],
        r[2],
        '<a href="' + r[3] + '" target="_blank" class="btn">VIEW</button></a>'
      ]
    }),
    columns: sheet.data[0].map(function(c) {
      return { title: c }
    }),
    fixedHeader: true,
    responsive: { details: false }
    // order: [[1, 'desc']]
  })
}
