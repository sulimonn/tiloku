import { forwardRef, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  ListItemButton,
  ListItemText,
  Typography,
  Collapse,
  List,
} from "@mui/material";

// project import
import { activeChapter } from "store/reducers/menu";
import { activeVideo, openPage } from "store/reducers/actions";
import NavChapterItem from "./NavChapterItem";

const NavClassItem = ({ item, level, index, parentUrl }) => {
  const { id, chapterId, subChapterId } = useParams();
  const [hide, setHide] = useState(id ? true : false);

  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const children = useSelector(
    (state) =>
      state.subChapters.find(
        (subChapter) => subChapter.parent === id + "-" + chapterId
      )?.children
  );

  const { drawerOpen, openChapter } = useSelector((state) => state.menu);

  let itemTarget = "_self";
  if (item.target) {
    itemTarget = "_blank";
  }

  let listItemProps = {
    component: forwardRef((props, ref) => (
      <Link
        ref={ref}
        {...props}
        to={!openChapter ? item.url : parentUrl}
        target={itemTarget}
      />
    )),
  };
  if (item?.external) {
    listItemProps = { component: "a", href: item.url, target: itemTarget };
  }

  const itemHandler = (itemId) => {
    dispatch(
      activeChapter({ openChapter: itemId === openChapter ? null : itemId })
    );
    dispatch(openPage({ openedPage: item?.page }));
    dispatch(activeVideo({ openVideo: false }));
  };

  const isSelected = openChapter === item.id;
  // active menu item on page load
  useEffect(() => {
    if (pathname.includes(item.url)) {
      dispatch(activeChapter({ openChapter: item.id }));
      if (!subChapterId) dispatch(openPage({ openedPage: item?.page }));
      dispatch(activeVideo({ openVideo: false }));
    }
    // eslint-disable-next-line
  }, [pathname]);

  useEffect(() => {
    if (!chapterId) {
      setHide("hiding");
      setTimeout(() => {
        setHide(true);
      }, 500);
    } else {
      setHide(false);
    }
  }, [chapterId]);
  console.log(hide);
  const textColor = "text.primary";
  const iconSelectedColor = "secondary.main";
  return (
    <>
      <ListItemButton
        {...listItemProps}
        disabled={item.disabled}
        onClick={() => itemHandler(item.id)}
        selected={isSelected}
        sx={{
          display: isSelected ? "flex" : !chapterId ? "flex" : "none",
          zIndex: 1201,
          borderBottom: `1px solid ${theme.palette.divider}`,
          pl: drawerOpen ? `${level * 30}px` : 1.5,
          py: !drawerOpen && level === 1 ? 0 : 0.3,
          ...(drawerOpen && {
            "&:hover": {
              bgcolor: "secondary.lighter",
            },
            "&.Mui-selected": {
              bgcolor: "secondary.lighter",
              borderRight: `2px solid ${theme.palette.secondary.main}`,
              color: iconSelectedColor,
              "&:hover": {
                color: iconSelectedColor,
                bgcolor: "secondary.lighter",
              },
            },
          }),
          ...(!drawerOpen && {
            "&:hover": {
              bgcolor: "transparent",
            },
            "&.Mui-selected": {
              "&:hover": {
                bgcolor: "transparent",
              },
              bgcolor: "transparent",
            },
          }),
        }}
      >
        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <ListItemText
            secondary={
              <Typography
                variant="h6"
                sx={{
                  color: isSelected ? iconSelectedColor : textColor,
                  "&::first-letter": { textTransform: "uppercase" },
                }}
                whiteSpace="wrap"
              >
                {index}. {item.title}
              </Typography>
            }
          />
        )}
      </ListItemButton>
      {children && (
        <Collapse in={isSelected} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((chapterItem, i) => (
              <NavChapterItem
                key={chapterItem.id}
                item={chapterItem}
                level={level}
                index={i + 1}
                parentIndex={index}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default NavClassItem;
