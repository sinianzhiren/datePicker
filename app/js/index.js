(function () {
    let datepicker = window.datepicker
    let data, $wrapper
    let isOpen = false

    datepicker.buildUI = function (year, month) {
        data = window.datepicker.getMonthData(year, month)

        let html = `
<div class="ui-datepicker-header">
  <a href="#" class="ui-datepicker-btn ui-datepicker-pre-btn">&lt;</a>
  <a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>
  <span class="ui-datepicker-curr-month">${data.year}-${data.month.length > 1 ? data.month : '0' + data.month}</span>
</div>
 <div class="ui-datepicker-body">
  <table>
    <thead>
      <tr>
        <th>一</th>
        <th>二</th>
        <th>三</th>
        <th>四</th>
        <th>五</th>
        <th>六</th>
        <th>七</th>
      </tr>
    </thead>
    <tbody>`

        for (let i =0; i< data.days.length; i++){
            let everyData = data.days[i]
            if (i%7 === 0){
                html += '<tr>'
            }
            html += `<td data-date="${ everyData.date }">${ everyData.showDate }</td>`
            if (i%7 === 6){
                html += '</tr>'
            }
        }

        html += `
            </tbody>
            </table>
            </div>`

        return html
    }

    datepicker.render = function (direction){
        let year, month;
        if (data){
            year = data.year
            month = data.month
        }

        if (direction === 'prev') month--;
        if (direction === 'next') month++;

        let html = datepicker.buildUI(year, month)

        if (!$wrapper){
            $wrapper = document.createElement('div')
            $wrapper.className = 'ui-datepicker-wrapper'
            document.body.appendChild($wrapper)
        }
        $wrapper.innerHTML = html
    }

    datepicker.init = function (input) {
        datepicker.render()

        let $input = document.querySelector(input)

        $input.addEventListener('click', function () {
            if (isOpen) {
                $wrapper.classList.remove('ui-datepicker-wrapper-show')
                isOpen = false
            } else {
                $wrapper.classList.add('ui-datepicker-wrapper-show')
                let left = $input.offsetLeft
                let top = $input.offsetTop
                let height = $input.offsetHeight
                $wrapper.style.top = top + height + 2 + 'px'
                $wrapper.style.left = left + 'px'
                isOpen = true
            }
        })

        $wrapper.addEventListener('click', function (e) {
            let $target = e.target
            if (!$target.classList.contains('ui-datepicker-btn')) return;

            // 上一个月
            if ($target.classList.contains('ui-datepicker-pre-btn')) {
                datepicker.render('prev')
            } else if ($target.classList.contains('ui-datepicker-next-btn')) {
                datepicker.render('next')
            }
        })

        // 点击时间在输入框显示
        $wrapper.addEventListener('click', function (e) {
            let $target = e.target
            if ($target.tagName.toLowerCase() !== 'td') return;

            let tr_date = new Date(data.year, data.month - 1, $target.dataset.date)

            $input.value = format(tr_date)
            $wrapper.classList.remove('ui-datepicker-wrapper-show')
            isOpen = false
        })
    }

    function format(date) {
        let ret = ''

        ret += date.getFullYear() + '-'
        ret += format.padding(date.getMonth() + 1) + '-'
        ret += format.padding(date.getDate())

        return ret
    }

    format.padding = function (num) {
        return num <= 9? '0'+ num : num
    }
})()