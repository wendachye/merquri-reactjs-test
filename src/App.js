import React, { useState, useEffect } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import moment from "moment";
import "./App.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#001127",
    },
    secondary: {
      main: "#3094c6",
    },
  },
});

function App() {
  const [value, setValue] = useState({
    city: "",
    country: "",
    showRequired: false,
    result: null,
    resultNotFound: false,
    history: [],
  });

  useEffect(() => {
    const fetchSearchHistory = () => {
      const history = JSON.parse(localStorage.getItem("SEARCH_HISTORY"));

      if (history) {
        setValue({
          ...value,
          history,
        });
      }
    };

    fetchSearchHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeText = (e) => {
    switch (e.target.name) {
      case "city":
        setValue({
          ...value,
          city: e.target.value,
        });
        break;
      case "country":
        setValue({
          ...value,
          country: e.target.value,
        });
        break;
      default:
        break;
    }
  };

  const fetchWeather = async (place) => {
    try {
      const { data } = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=2b353b3106f450d207c0b5d8da5f4fb2`
      );

      let result = {
        id: moment().format(),
        place: `${data?.name}, ${data?.sys?.country}`,
        main: data?.weather?.[0]?.main || "",
        description: data?.weather?.[0]?.description || "",
        humidity: data?.main?.humidity || "",
        tempMin: data?.main?.temp_min || "",
        tempMax: data?.main?.temp_max || "",
        createdTime: moment().format("YYYY-MM-DD hh:mm a"),
      };

      return result;
    } catch (error) {
      throw error;
    }
  };

  const onClickSearch = async () => {
    try {
      if (value.city || value.country) {
        let place = "";

        if (value.city && value.country) {
          place = `${value.city},${value.country}`;
        } else if (value.city) {
          place = `${value.city}`;
        } else {
          place = `${value.country}`;
        }

        const result = await fetchWeather(place);

        let history = [result, ...value.history];

        localStorage.setItem("SEARCH_HISTORY", JSON.stringify(history));

        setValue({
          ...value,
          city: "",
          country: "",
          showRequired: false,
          result,
          resultNotFound: false,
          history,
        });
      } else {
        setValue({
          ...value,
          showRequired: true,
        });
      }
    } catch (error) {
      setValue({
        ...value,
        showRequired: false,
        result: null,
        resultNotFound: true,
      });
    }
  };

  const onClickClear = () => {
    setValue({
      city: "",
      country: "",
    });
  };

  const onClickSearchHistory = async (searchHistory) => {
    try {
      const result = await fetchWeather(searchHistory?.place);

      let history = [result, ...value.history];

      localStorage.setItem("SEARCH_HISTORY", JSON.stringify(history));

      setValue({
        ...value,
        result,
        resultNotFound: false,
        history,
      });
    } catch (error) {
      setValue({
        ...value,
        result: null,
        resultNotFound: true,
      });
    }
  };

  const onClickDeleteHistory = (searchHistory) => {
    let history = value.history.filter(
      (history) => history.id !== searchHistory.id
    );

    localStorage.setItem("SEARCH_HISTORY", JSON.stringify(history));

    setValue({
      ...value,
      history,
    });
  };

  const renderHistory = (history, key) => {
    return (
      <div key={key}>
        <Grid
          container
          className="gridContainer"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12} md={8}>
            <div>{`${key + 1}. ${history.place}`}</div>
          </Grid>
          <Grid item xs={8} md={2}>
            <div>{history.createdTime}</div>
          </Grid>
          <Grid item xs={2} md={1} className="gridItemIconButton">
            <IconButton
              color="primary"
              onClick={() => onClickSearchHistory(history)}
            >
              <SearchIcon />
            </IconButton>
          </Grid>
          <Grid item xs={2} md={1} className="gridItemIconButton">
            <IconButton
              color="primary"
              onClick={() => onClickDeleteHistory(history)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <div className="headerTitle">{`Today's Weather`}</div>
        <Divider variant="middle" />
        <Grid
          container
          className="gridContainer"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12} md={4} className="gridItem">
            <TextField
              fullWidth
              margin="dense"
              variant="outlined"
              label="City"
              name="city"
              error={value.showRequired}
              helperText={value.showRequired && "Please enter a city name"}
              value={value.city}
              onChange={(e) => onChangeText(e)}
            />
          </Grid>
          <Grid item xs={12} md={4} className="gridItem">
            <TextField
              fullWidth
              margin="dense"
              variant="outlined"
              label="Country"
              name="country"
              value={value.country}
              onChange={(e) => onChangeText(e)}
            />
          </Grid>
          <Grid item xs={12} md={2} className="gridItem">
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={onClickSearch}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={12} md={2} className="gridItem">
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={onClickClear}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
        {value.result && (
          <Grid
            container
            className="gridContainer"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <Grid item xs={12}>
                <div className="placeText">{value.result.place}</div>
              </Grid>
              <Grid item xs={12}>
                <div className="weatherText">{value.result.main}</div>
              </Grid>
              <Grid item xs={12}>
                <Grid container className="weatherContainer">
                  <Grid item xs={6}>
                    <div className="weatherLabel">Description:</div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="weatherValue">
                      {value.result.description}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container className="weatherContainer">
                  <Grid item xs={6}>
                    <div className="weatherLabel">Temperature:</div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="weatherValue">
                      {`${value.result.tempMin}°C ~ ${value.result.tempMax}°C`}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container className="weatherContainer">
                  <Grid item xs={6}>
                    <div className="weatherLabel">Humidity:</div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="weatherValue">
                      {`${value.result.humidity}%`}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container className="weatherContainer">
                  <Grid item xs={6}>
                    <div className="weatherLabel">Time:</div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="weatherValue">
                      {`${value.result.createdTime}`}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        {value.resultNotFound && (
          <Grid
            container
            className="gridContainer"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <div className="resultNotFound">City or Country not found</div>
            </Grid>
          </Grid>
        )}
        <div className="historyContainer">
          <div className="subheaderTitle">{`Search History`}</div>
          <Divider variant="middle" />
          {value?.history?.map((history, key) => renderHistory(history, key))}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
