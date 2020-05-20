import React, { Component } from "react";
import styled from "styled-components";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { apiKey } from "./api";

const Title = styled.div`
  background-color: #99e2ef;
  color: white;
  width: 100%;
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  padding: 20px 0;
`;

const Main = styled.div`
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const Container = styled.div`
  margin: 20px auto;
  display: grid;
  max-width: 1200px;
  min-height: 300px;
  margin-bottom: 80px;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
`;

const Label = styled.div`
  position: relative;
  border: 1px solid #99e2ef;
  background-color: #99e2ef;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  width: 150px;
  height: 50px;
  margin: 30px 0 30px 168px;
`;

class App extends Component {
  constructor() {
    super();
    this.state = {
      selected: Array(47).fill(false),
      prefectures: {},
      series: [],
    };
    this._changeSelection = this._changeSelection.bind(this);
  }

  componentDidMount() {
    fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures", {
      headers: { "X-API-KEY": apiKey },
    })
      .then((response) => response.json())
      .then((res) => {
        this.setState({ prefectures: res.result });
      });
  }

  _changeSelection(index) {
    const selected_copy = this.state.selected.slice();
    selected_copy[index] = !selected_copy[index];

    if (!this.state.selected[index]) {
      fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${
          index + 1
        }`,
        {
          headers: { "X-API-KEY": apiKey },
        }
      )
        .then((response) => response.json())
        .then((res) => {
          let tmp = [];
          Object.keys(res.result.data[0].data).forEach((i) => {
            tmp.push(res.result.data[0].data[i].value);
          });
          const res_series = {
            name: this.state.prefectures[index].prefName,
            data: tmp,
          };
          this.setState({
            selected: selected_copy,
            series: [...this.state.series, res_series],
          });
        });
    } else {
      const series_copy = this.state.series.slice();

      for (let i = 0; i < series_copy.length; i++) {
        if (series_copy[i].name == this.state.prefectures[index].prefName) {
          series_copy.splice(i, 1);
        }
      }
      this.setState({
        selected: selected_copy,
        series: series_copy,
      });
    }
  }

  renderItem(props) {
    return (
      <div key={props.prefCode} style={{ margin: "5px", width: "100px" }}>
        <input
          type="checkbox"
          checked={this.state.selected[props.prefCode - 1]}
          onChange={() => this._changeSelection(props.prefCode - 1)}
        />
        <span>{props.prefName}</span>
      </div>
    );
  }

  render() {
    const obj = this.state.prefectures;
    const options = {
      chart: {
        type: "line",
      },
      title: {
        text: "都道府県別 総人口推移",
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "top",
        itemMarginTop: 20,
        itemStyle: {
          fontSize: "15px",
        },
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointInterval: 5,
          pointStart: 1960,
        },
      },
      yAxis: {
        labels: {
          formatter: function () {
            return this.value === 0 ? "" : this.value.toLocaleString() + "人";
          },
        },
        min: 0,
        gridLineColor: "transparent",
        tickWidth: 1,
        tickInterval: 500000,
        title: {
          text: "人口数",
          textAlign: "right",
          rotation: 0,
          x: 90,
          y: -170,
        },
        lineWidth: 1,
      },
      xAxis: {
        labels: {
          formatter: function () {
            return this.value + "年";
          },
        },
        title: {
          text: "年数",
          x: 510,
          y: -32,
        },
        tickInterval: 10,
      },
      series: this.state.series,
    };
    return (
      <>
        <div>
          <Title>RESAS APP</Title>
          <Main>
            <Label>都道府県</Label>
            <Container>
              {Object.keys(obj).map((i) => this.renderItem(obj[i]))}
            </Container>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </Main>
        </div>
      </>
    );
  }
}

export default App;
