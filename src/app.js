let api_url = "https://brgk.b777.win/";
const App = {
  data() {
    return {
      datepicker: [new Date(), new Date()],
      tableData: [],
      selected: "all",
      games: [],
      username: "brgk880070953",
      msg: "",
      total_winloss: "",
      total_commission: "",
      total_total: "",
      total_valid_amount: "",
      total_turnover: "",
    };
  },
  methods: {
    async getlistGames() {
      let game_list = [];
      this.games.status = true;
      await axios({
        method: "GET",
        url: api_url + "api/getProviders",
      }).then((res) => {
        this.games.data = res.data;
        for (let i = 0; i < this.games.data.length; i++) {
          game_list.push({
            game: this.games.data[i],
            status: false,
          });
        }
        this.games.data = game_list;
        this.disabledDate();
      });
    },

    disabledDate(time) {
      return time > Date.now();
    },

    change(event) {
      if (event[1] != null) {
        let dateStart = moment(event[0]).format("MM/DD/YYYY 00:00:00");
        const [dateValues, timeStar] = dateStart.split(" ");
        const [monthS, dayS, yearS] = dateValues.split("/");
        const [hoursS, minutesS, secondsS] = timeStar.split(":");
        dateStart = new Date(
          +yearS,
          monthS - 1,
          +dayS,
          +hoursS,
          +minutesS,
          +secondsS
        );

        let dateEnd = moment(event[1]).format("MM/DD/YYYY 23:59:59");
        const [dateValuesE, timeStarE] = dateEnd.split(" ");
        const [monthE, dayE, yearE] = dateValuesE.split("/");
        const [hoursE, minutesE, secondsE] = timeStarE.split(":");
        dateEnd = new Date(
          +yearE,
          monthE - 1,
          +dayE,
          +hoursE,
          +minutesE,
          +secondsE
        );
        this.defaultTime = [dateStart, dateEnd];
        this.datepicker = [dateStart, dateEnd];
      }
    },

    async submitReport() {
      let submit = true;
      this.tableData = [];
      this.msg = "";
      let selected;

      if (submit) {
        let start = Math.floor(this.datepicker[0].getTime() / 1000);
        let end = Math.floor(this.datepicker[1].getTime() / 1000);
        if (this.selected == "all" || this.selected == "") {
          selected = "";
        } else {
          selected = this.selected;
        }
        var data = JSON.stringify({
          username: this.username,
          start: start,
          end: end,
          provider: selected,
        });

        await axios({
          method: "post",
          url: api_url + "api/getBetlogByUsername",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        }).then((response) => {
          if (response.data.length != 0) {
            this.tableData = response.data;

            let winloss = 0;
            let commission = 0;
            let total = 0;
            let turnover = 0;
            let valid_amount = 0;
            this.tableData.forEach((element) => {
              turnover += parseFloat(element.turnover);
              valid_amount += parseFloat(element.valid_amount);
              winloss += parseFloat(element.winloss);
              commission += parseFloat(element.commission);
              total += parseFloat(element.total);
            });
            this.total_winloss = winloss;
            this.total_commission = commission;
            this.total_total = total;
            this.total_turnover = turnover;
            this.total_valid_amount = valid_amount;
          } else {
            this.msg = "ไม่พบรายการ";
          }
        });
      }
    },

    formatMoney(value) {
      let num, str;
      if (value === undefined || value === null) {
        return "0";
      } else if (typeof value === "number") {
        num = value.toFixed(2);
      } else {
        num = value;
      }
      str = num.toString().split(".");
      let label = "0";
      if (str[0].length >= 4) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
      }
      if (str[1]) {
        label = str[0] + "." + str[1];
      } else {
        label = str[0] + ".00";
      }
      return label;
    },
    formatMemer(value) {
      let num, str;
      if (value === undefined || value === null) {
        return "0";
      } else {
        num = value;
      }
      str = num.toString().split(".");
      let label = "0";
      if (str[0].length >= 4) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
      }
      label = str[0];
      return label;
    },
  },
  async created() {
    this.getlistGames();
    let dateStart = moment(new Date()).format("MM/DD/YYYY 00:00:00");
    const [dateValues, timeStar] = dateStart.split(" ");
    const [monthS, dayS, yearS] = dateValues.split("/");
    const [hoursS, minutesS, secondsS] = timeStar.split(":");
    dateStart = new Date(
      +yearS,
      monthS - 1,
      +dayS,
      +hoursS,
      +minutesS,
      +secondsS
    );

    let dateEnd = moment(new Date()).format("MM/DD/YYYY 23:59:59");
    const [dateValuesE, timeStarE] = dateEnd.split(" ");
    const [monthE, dayE, yearE] = dateValuesE.split("/");
    const [hoursE, minutesE, secondsE] = timeStarE.split(":");
    dateEnd = new Date(
      +yearE,
      monthE - 1,
      +dayE,
      +hoursE,
      +minutesE,
      +secondsE
    );

    this.datepicker = [dateStart, dateEnd];
    this.defaultTime = [dateStart, dateEnd];
  },
};
const app = Vue.createApp(App);
app.use(ElementPlus);
app.mount("#app");
