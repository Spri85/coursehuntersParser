$(function() {
	$('#getCourse').click(function() {
		var list = [];
		var output = $('.output')[0];

		var url =
			$('#url')[0].value ||
			'https://coursehunter.net/course/react-redux-professionalnaya-razrabotka';

		$.get(url, function(data) {
			var lesson = {};

			var lessNames = Array.from(
				$(data).find('.lessons-item .lessons-name')
			).map(item => item.textContent);
			lessNames = formatingNames(lessNames);

			var courseDetails = Array.from(
				$(data).find('.course-box-item .course-box-right')
			).map(div => {
				const titleDiv = $(div).find('.course-box-title')[0];
				const valueDiv = $(div).find('.course-box-value')[0];
				const title = titleDiv ? titleDiv.textContent : '';
				const value = valueDiv ? valueDiv.textContent : '';
				return { title, value };
			});

			console.log('courseDetails:::', courseDetails);

			var lessDurations = Array.from(
				$(data).find('.lessons-item .lessons-duration')
			).map(item => item.textContent);

			var lessLinks = Array.from(
				$(data).find(".lessons-item link[itemprop='url']")
			).map(item => item.href);

			var courseTitle = Array.from($(data).find('.hero-title')).map(
				item => item.textContent
			)[0];
			// var publisher = Array.from($(data).find('.go-to-publisher'));

			for (var i = 0; i < lessNames.length; i++) {
				lesson.name = lessNames[i];
				lesson.duration = lessDurations[i];
				lesson.link = lessLinks[i];

				list.push({ ...lesson });
			}

			let courseDetailsDom = '';
			courseDetails.forEach(item => {
				courseDetailsDom += `
				<div>
        <span>${item.title}</span>
        <span>${item.value}</span>
      </div>`;
			});

			output.innerHTML = ` 
      <h1 class="text-center heading-1">${courseTitle}</h1>
			<h2 class="heading-2 copy__table">Export To Excel</h2>
	
      <div>
       ${courseDetailsDom}
      </div>

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
			$.each(list, function(i, item) {
				outputInner.append(
					`<tr scope="row"><td>
          ${item.name}
          </td>
            <td><a class='lesson__link' href='${item.link}' target='_blank'>${item.link}</a></td>
            <td>
          ${item.duration}
            </td></tr>`
				);
			});
		});
	});

	$(document).on('click touchstart', '.copy__table', function() {
		exportTableToExcel('table', 'CourseLessonsList');
	});

	function exportTableToExcel(tableID, filename = '') {
		var downloadLink;
		var dataType = 'application/vnd.ms-excel';
		var tableSelect = document.getElementById(tableID);
		var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

		// Specify file name
		filename = filename ? filename + '.xls' : 'excel_data.xls';

		// Create download link element
		downloadLink = document.createElement('a');

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

	function formatingNames(arr) {
		let maxLesson = digitLessonNumber(arr); // get qty digits in last lesson
		let newArr = arr.map((item, i) => {
			//formating number like 1 -> 01 if max digits 2
			//                      1 --> 001 if max digits 3
			item = i + 1 + '_' + item;
			let currentNumberDigits = (i + 1).toString().length;
			if (currentNumberDigits < maxLesson) {
				for (let j = currentNumberDigits; j < maxLesson; j++) {
					item = '0' + item;
				}
			}

			return item + '.mp4';
		});

		return newArr;
	}

	function digitLessonNumber(arr) {
		// getting max digits in last lesson number
		const maxNumbers = arr.length.toString().length;
		return maxNumbers;
	}
});
