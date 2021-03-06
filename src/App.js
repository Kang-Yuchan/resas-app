import React, { Component } from "react";
import styled from "styled-components";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { apiData } from "./api";
import Loader from "./Loader";

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
      loading: true,
    };
    this._changeSelection = this._changeSelection.bind(this);
  }

  async componentDidMount() {
    try {
      const {
        data: { result: locations },
      } = await apiData.locations();
      this.setState({ prefectures: locations });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  }

  _changeSelection(index) {
    const { selected, prefectures, series } = this.state;
    const selected_copy = selected.slice();
    selected_copy[index] = !selected_copy[index];

    const fetchApi = async (code) => {
      try {
        const {
          data: {
            result: { data: population },
          },
        } = await apiData.population(code);

        const total_population = population[0];
        let tmp = [];

        Object.keys(total_population.data).forEach((i) => {
          tmp.push(total_population.data[i].value);
        });
        const res_series = {
          name: prefectures[index].prefName,
          data: tmp,
        };
        this.setState({
          selected: selected_copy,
          series: [...series, res_series],
        });
      } catch (err) {
        console.log(err);
      }
    };

    if (!selected[index]) {
      fetchApi(index);
    } else {
      const series_copy = series.slice();

      for (let i = 0; i < series_copy.length; i++) {
        if (series_copy[i].name === prefectures[index].prefName) {
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
    const { selected } = this.state;
    return (
      <div key={props.prefCode} style={{ margin: "5px", width: "100px" }}>
        <input
          type="checkbox"
          checked={selected[props.prefCode - 1]}
          onChange={() => this._changeSelection(props.prefCode - 1)}
        />
        <span>{props.prefName}</span>
      </div>
    );
  }

  render() {
    const { prefectures, series, loading } = this.state;
    const obj = prefectures;
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
      series: series,
    };
    return (
      <>
        {loading ? (
          <Loader />
        ) : (
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
        )}
      </>
    );
  }
}

export default App;
