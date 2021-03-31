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

const useStyles = makeStyles({
  gridContainer: {
    margin: 15,
  },
  textField: {
    margin: 10,
  },
});

function App() {
  const classes = useStyles();
  const [value, setValue] = useState({
    city: "",
    country: "",
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

  const onClickSearch = () => {};

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
        <Grid container className={classes.gridContainer}>
          <Grid item>
            <TextField
              classes={{
                root: classes.textField,
              }}
              required
              margin="dense"
              variant="outlined"
              label="City"
              name="city"
              value={value.city}
              onChange={(e) => onChangeText(e)}
            />
          </Grid>
          <Grid item>
            <TextField
              classes={{
                root: classes.textField,
              }}
              required
              margin="dense"
              variant="outlined"
              label="Country"
              name="country"
              value={value.country}
              onChange={(e) => onChangeText(e)}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={onClickSearch}>
              Search
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={onClickClear}>
              Clear
            </Button>
          </Grid>
          <Grid item></Grid>
        </Grid>
        <div></div>
      </div>
    </ThemeProvider>
  );
}

export default App;
