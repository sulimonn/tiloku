// material-ui
import {
  Box,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

// assets
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import classes from "menu-items/classes";
import { useSelector } from "react-redux";

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = () => {
  const [input, setInput] = useState("");
  const subChapters = useSelector((state) => state.subChapters);
  const [suggestions, setSuggestions] = useState([]);
  const handleChange = (e) => {
    setInput(e.target.value);
    setSuggestions(() => [
      ...classes.children.filter(
        (item) =>
          item.title.toLowerCase().includes(e.target.value.toLowerCase()) &&
          item
      ),
    ]);
    setSuggestions((prev) => [
      ...prev,
      ...classes.children
        .flatMap((item) => item.children)
        .concat()
        .filter(
          (item) =>
            item.title.toLowerCase().includes(e.target.value.toLowerCase()) &&
            item
        ),
    ]);
    setSuggestions((prev) => [
      ...prev,
      ...subChapters
        .flatMap((item) => item.children)
        .concat()
        .filter(
          (item) =>
            item.title.toLowerCase().includes(e.target.value.toLowerCase()) &&
            item
        ),
    ]);
    console.log(suggestions);
  };
  return (
    <Box sx={{ width: "auto", ml: { xs: 0, md: 1 } }} position="relative">
      <FormControl sx={{ width: { xs: "100%", md: 224 } }}>
        <OutlinedInput
          size="small"
          id="header-search"
          value={input}
          onChange={handleChange}
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5 }}>
              <SearchOutlined />
            </InputAdornment>
          }
          aria-describedby="header-search-text"
          inputProps={{
            "aria-label": "weight",
          }}
          placeholder="Ctrl + K"
        />
      </FormControl>
      {suggestions.length > 0 && input && (
        <Box position="absolute" left="0" right="0" top="100%">
          <Box
            sx={{ backgroundColor: "secondary.lighter", p: 1 }}
            maxHeight={400}
            overflow="auto"
          >
            {suggestions.map((item) => (
              <Typography
                component={Link}
                to={item.url}
                key={item.id}
                sx={{
                  display: "block",
                  textDecoration: "none",
                  color: "black",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {item.title}
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Search;
