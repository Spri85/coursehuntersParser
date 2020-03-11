$(function() {
	var courseTitle = '';
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

			courseTitle = Array.from($(data).find('.hero-title')).map(
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
		tableToExcel('table', courseTitle, courseTitle + '.xls');
	});

	var tableToExcel = (function() {
		var uri = 'data:application/vnd.ms-excel;base64,',
			template =
				'<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
			base64 = function(s) {
				return window.btoa(unescape(encodeURIComponent(s)));
			},
			format = function(s, c) {
				return s.replace(/{(\w+)}/g, function(m, p) {
					return c[p];
				});
			},
			downloadURI = function(uri, name) {
				var link = document.createElement('a');
				link.download = name;
				link.href = uri;
				link.click();
			};

		return function(table, name, fileName) {
			if (!table.nodeType) table = document.getElementById(table);
			var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };
			var resuri = uri + base64(format(template, ctx));
			downloadURI(resuri, fileName);
		};
	})();

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
