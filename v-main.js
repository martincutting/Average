var avg = Vue.createApp({
    template: `
        <div id="interface">
            <div id="prompt">
                <span class="title"><b>Enter your numbers below and click the 'Give me my averages' button:</b></span><br />
                <span class="subtitle">Numbers can be separated by commas or spaces</span>
            </div>
            <div id="input">
                <input id="input-numbers" type="text" @keydown="filterInput" @keyup="enableButton">
            </div>
            <div id="buttondiv">
                <button id="calcAverages" @click="getNumbers()" disabled>Give me my averages!</button>
            </div>
            <div id="results" v-if="numberlist.length > 1">
                <div class="results-title"><div>Here are your numbers:</div></div>
                <div id="number-list">
                    <div class="number" v-for="number in numberlist"><div class="number-text">{{number}}</div></div>
                </div>
                <div class="results-title"><div>Here are your averages:</div></div>
                <div id="averages">
                    <div class="average-div"><div class="average-text"><b>Mean:</b><br />{{mean}}</div></div>
                    <div class="average-div"><div class="average-text"><b>Mode:</b><br />{{mode}}</div></div>
                    <div class="average-div"><div class="average-text"><b>Median:</b><br />{{median}}</div></div>
                </div>
            </div>
            <div id="error"><div>Sorry... couldn't find two or more numbers in your list.</div></div>
        </div>
    `,

    data() {
        return {
          numberlist: [],
          allowedInput: "1234567890-., ".split("").concat(["backspace", "delete", "arrowleft", "arrowright"])
        }
    },

    methods: {
        getNumbers() {
            this.numberlist = []
            const character = this.determineSeparator()
            if (character != '') {
                $("#input-numbers").val().trim().split(character).forEach(number => {
                    number = number.replace(/[^0-9\-\.]+/g, '')
                    if (number.match(/^-?([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[0-9]+|0)$/) !== null) { this.numberlist.push(parseFloat(number)) }
                })
            }
            $("#error").css('visibility', (this.numberlist.length > 0 ? 'hidden' : 'visible'))
            this.numberlist.sort(function(x, y) { return x - y })
        },
        determineSeparator() {
            var separator = { character: '', count: 0 }
            Array.from(new Set($("#input-numbers").val().trim().replace(/[0-9.-]/g, ''))).forEach(character => {
                if ($("#input-numbers").val().trim().split(character).length > separator.count) {
                    separator.character = character; separator.count = $("#input-numbers").val().trim().split(character).length
                }
            })
            return separator.count < 2 ? '' : separator.character
        },
        filterInput(e) {
            if (e.ctrlKey && "va".includes(e.key.toLowerCase())) { return true }
            if (e.key.toLowerCase() == "enter") {
              e.preventDefault()
              this.getNumbers()
            } else if (!this.allowedInput.includes(e.key.toLowerCase())) { e.preventDefault() }
        },
        enableButton() {
            $("#calcAverages").prop('disabled', $("#input-numbers").val().trim() != "" ? false : true)
        },
        round(number, decimalPlaces = 0) {
            if (number < 0) { return -round(-number, decimalPlaces) }
            number = Math.round(number + "e" + decimalPlaces)
            return Number(number + "e" + -decimalPlaces)
        },
    },
  
    computed: {
      mean() {
        return this.round((this.numberlist.reduce((sum, number) => sum + number, 0) / this.numberlist.length), 2)
      },
      mode() {
        const modeCount = { count: 0, values: [] }
        this.numberlist.forEach(value => {
            var count = this.numberlist.filter(x => x == value).length
            if (count >= modeCount.count && !modeCount.values.includes(value)) {
                if (count > modeCount.count) { modeCount.values = [value] } else { modeCount.values.push(value) }
                modeCount.count = count
            }
        })
        return modeCount.values.join(", ")
      },
      median() {
        var valueAtHalfwayFloor = this.numberlist[Math.floor((this.numberlist.length - 1) / 2)]
        var valueAtHalfwayCeil = this.numberlist[Math.ceil((this.numberlist.length - 1) / 2)]
        return this.numberlist.length % 2 == 0 ? this.round(((valueAtHalfwayFloor + valueAtHalfwayCeil) / 2), 2) : valueAtHalfwayFloor
      }
    },

  })
