import React, { useState } from "react";
import {
  ThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
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

const useStyles = makeStyles({});

function App() {
  const classes = useStyles();
  const [value, setValue] = useState({
    city: "",
    country: "",
    showRequired: false,
    result: null,
    history: [],
  });

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

  const onClickSearch = async () => {
    try {
      if (value.city || value.country) {
        const { data } = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?q=${value.city},${value.country}&appid=2b353b3106f450d207c0b5d8da5f4fb2`
        );

        let result = {
          place: `${data?.name}, ${data?.sys?.country}`,
          main: data?.weather?.[0]?.main || "",
          description: data?.weather?.[0]?.description || "",
          humidity: data?.main?.humidity || "",
          tempMin: data?.main?.temp_min || "",
          tempMax: data?.main?.temp_max || "",
          createdTime: moment().format("YYYY-MM-DD hh:mm a"),
        };

        setValue({
          ...value,
          city: "",
          country: "",
          showRequired: false,
          result,
          history: [...value.history, result],
        });
      } else {
        setValue({
          ...value,
          showRequired: true,
        });
      }
    } catch (error) {
      console.log(error);

      setValue({
        ...value,
        showRequired: false,
        result: null,
      });
    }
  };

  const onClickClear = () => {
    setValue({
      city: "",
      country: "",
    });
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
        <div className="historyContainer">
          <div className="subheaderTitle">{`Search History`}</div>
          <Divider variant="middle" />
          {value.history.map((hist) => {
            return <div>{hist.place}</div>;
          })}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
