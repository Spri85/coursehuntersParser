$(function () {
  $('#getCourse').click(function () {
    var list = [];
    var output = $('.output')[0];

    var url =
      $('#url')[0].value ||
      'https://coursehunters.net/course/polnoe-rukovodstvo-razrabotchika-2018-ot-dzhunika-k-senoru';

    $.get(url, function (data) {
      var lesson = {};

      var lessNames = Array.from($(data).find('.lessons-list__li span'));
      var lessDurations = Array.from($(data).find('.lessons-list__li em'));
      var lessLinks = Array.from(
        $(data).find(".lessons-list__li link[itemprop='url']")
      );
      var courseTitle = Array.from($(data).find('.original-name'));
      var publisher = Array.from($(data).find('.go-to-publisher'));

      lessNames = clearText(lessNames);
      lessNames = formatingNames(lessNames);

      lessDurations = clearText(lessDurations);
      publisher = clearText(publisher)[0];
      courseTitle = clearText(courseTitle)[0];

      for (var i = 0; i < lessNames.length; i++) {
        lesson.name = lessNames[i];
        lesson.duration = lessDurations[i];
        lesson.link = lessLinks[i].href;

        list.push({ ...lesson
        });
      }

      output.innerHTML = ` 
      <h1 class="text-center heading-1">${courseTitle}</h1>
      <h2 class="heading-2 copy__table text-left float-left">Export To Excel</h2>
      <h2 class="heading-2 text-right">${publisher}</h2>
      <div class="table-responsive">
      <table class='table table-hover' id="table">
        <thead>
          <tr>
            <th scope="col">Lesson:</th>
            <th scope="col">URL</th>
            <th scope="col">Duration</th>
          </tr>
        </thead>
        <tbody class='table__body'>
        </tbody>
      </table>
      </div>`;

      var outputInner = $('.table__body');
      $.each(list, function (i, item) {
        outputInner.append(
          `<tr scope="row"><td>
          ${item.name}
          </td>
            <td><a class='lesson__link' href='${item.link}' target='_blank'>${
            item.link
          }</a></td>
            <td>
          ${item.duration}
            </td></tr>`
        );
      });
    });
  });

  $(document).on('click touchstart', '.copy__table', function () {
    exportTableToExcel('table', 'CourseLessonsList');
  });

  function clearText(arr) {
    var newArr = arr.map(item => {
      return item.innerHTML
        .replace(/Открыть/g, '')
        .replace(/все курсы от/g, '')
        .replace(/Урок/g, '')
        .replace(/\./g, '')
        .replace(/\"/g, "'")
        .trim();
    });
    return newArr;
  }

  function formatingNames(arr) {
    let maxLesson = digitLessonNumber(arr); // get qty digits in last lesson
    let newArr = arr.map(item => {
      //formating number like 1 -> 01 if max digits 2
      //                      1 --> 001 if max digits 3
      let lessNumber = item.substring(0, item.indexOf(' '));
      if (lessNumber.length < maxLesson) {
        for (let i = lessNumber.length; i < maxLesson; i++) {
          item = '0' + item;
        }
      }

      return item + '.mp4';
    });

    return newArr;
  }

  function digitLessonNumber(arr) {
    // getting max digits in last lesson number
    return arr[arr.length - 1].indexOf(' ');
  }

  function copyLessonsTable() {
    /* Get the text field */
    var copyText = $(".table__body td");

    copyText = copyText;
    console.log(copyText);

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copied the text: ");
  }

  function exportTableToExcel(tableID, filename = '') {
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

    // Specify file name
    filename = filename ? filename + '.xls' : 'excel_data.xls';

    // Create download link element
    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
      var blob = new Blob(['\ufeff', tableHTML], {
        type: dataType
      });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

      // Setting the file name
      downloadLink.download = filename;

      //triggering the function
      downloadLink.click();
    }
  }

});