# HƯỚNG DẪN SỬ DỤNG MATERIAL UI

## Giới thiệu

Material UI là thư viện UI phổ biến cho React, triển khai Material Design của Google. Tài liệu này cung cấp tổng quan về các components phổ biến nhất, cách sử dụng và các ví dụ từ dự án thực tế Gender Healthcare Frontend.

---

## Mục lục

1. [Cài đặt](#cài-đặt)
2. [Theme Setup](#theme-setup)
3. [Layout Components](#layout-components)
   - [Container](#container)
   - [Grid](#grid)
   - [Box](#box)
   - [Stack](#stack)
   - [Paper](#paper)
4. [Navigation Components](#navigation-components)
   - [AppBar](#appbar)
   - [Toolbar](#toolbar)
   - [Menu & MenuItem](#menu--menuitem)
   - [Drawer](#drawer)
   - [Tabs](#tabs)
   - [BottomNavigation](#bottomnavigation)
5. [Feedback Components](#feedback-components)
   - [Dialog](#dialog)
   - [Snackbar](#snackbar)
   - [CircularProgress](#circularprogress)
6. [Inputs & Controls](#inputs--controls)
   - [Button](#button)
   - [IconButton](#iconbutton)
   - [TextField](#textfield)
   - [InputAdornment](#inputadornment)
   - [Select](#select)
   - [Checkbox & Radio](#checkbox--radio)
   - [Switch](#switch)
   - [DatePicker](#datepicker)
7. [Data Display](#data-display)
   - [Typography](#typography)
   - [Card](#card)
   - [CardContent & CardMedia](#cardcontent--cardmedia)
   - [Table](#table)
   - [List](#list)
   - [Avatar](#avatar)
   - [Badge](#badge)
8. [Utils & Styling](#utils--styling)
   - [alpha](#alpha)
   - [useTheme](#usetheme)
   - [CssBaseline](#cssbaseline)
   - [styled API](#styled-api)
9. [Icons](#icons)
10. [Templates & Patterns](#templates--patterns)
11. [Styling](#styling-trong-material-ui)
12. [Examples từ Dự Án](#examples-từ-dự-án)

---

## Cài đặt

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

Đối với dự án sử dụng styled-components, có thể cài:

```bash
npm install @mui/material @mui/icons-material @mui/styled-engine-sc styled-components
```

**Trong dự án hiện tại:**

```json
{
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.0",
  "@mui/icons-material": "^7.1.0",
  "@mui/material": "^7.1.0"
}
```

---

## Theme Setup

**Công dụng**: Thiết lập theme toàn cục cho ứng dụng.

**Ví dụ từ dự án** (`src/context/ThemeContext.js`):

```jsx
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

export const CustomThemeProvider = ({ children }) => (
  <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
);
```

**Sử dụng trong App** (`src/App.js`):

```jsx
import { CssBaseline } from "@mui/material";
import { CustomThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      {/* App content */}
    </CustomThemeProvider>
  );
}
```

---

## Layout Components

### Container

**Công dụng**: Tạo một container có chiều rộng hạn chế và căn giữa nội dung.

**Props phổ biến:**

- `maxWidth`: 'xs', 'sm', 'md', 'lg', 'xl' (độ rộng tối đa)
- `fixed`: Boolean (chiều rộng cố định thay vì linh hoạt đến maxWidth)
- `disableGutters`: Boolean (bỏ padding ngang)

**Ví dụ từ dự án** (`src/components/pages/HomePage.js`):

```jsx
import { Container } from "@mui/material";

<Container maxWidth="lg">
  <Typography variant="h2" align="center" gutterBottom>
    Welcome to Gender Healthcare
  </Typography>
</Container>;
```

### Grid

**Công dụng**: Tạo layout responsive với hệ thống lưới 12 cột.

**Props phổ biến:**

- `container`: Đánh dấu grid container
- `item`: Đánh dấu grid item
- `xs`, `sm`, `md`, `lg`, `xl`: Số cột chiếm (1-12) ở mỗi breakpoint
- `spacing`: Khoảng cách giữa các items (1 = 8px)
- `direction`: 'row', 'column', 'row-reverse', 'column-reverse'
- `justifyContent`: 'flex-start', 'center', 'flex-end', 'space-between', 'space-around'
- `alignItems`: 'flex-start', 'center', 'flex-end', 'stretch', 'baseline'

**Ví dụ từ dự án** (`src/components/pages/HomePage.js`):

```jsx
<Grid container spacing={4}>
  {[1, 2, 3].map((item) => (
    <Grid item key={item} xs={12} sm={6} md={4}>
      <Card sx={{ height: "100%" }}>
        <CardMedia
          component="img"
          height="140"
          image={`https://source.unsplash.com/random/300×200/?health&sig=${item}`}
        />
        <CardContent>
          <Typography variant="h5" component="h3">
            Service {item}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
```

### Box

**Công dụng**: Component linh hoạt để tạo khối nội dung với các thuộc tính CSS thông qua hệ thống `sx`.

**Props phổ biến:**

- `sx`: Object chứa CSS properties với cú pháp ngắn gọn
- `component`: Thành phần HTML/React để render (mặc định là 'div')

**Ví dụ từ dự án** (`src/components/pages/RegisterPage.js`):

```jsx
<Box
  sx={{
    minHeight: "100vh",
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.primary.main,
      0.1
    )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
    py: 4,
    display: "flex",
    alignItems: "center",
  }}
>
  {/* Content */}
</Box>
```

### Paper

**Công dụng**: Tạo surface với material design elevation (bóng đổ).

**Props phổ biến:**

- `elevation`: Mức độ bóng đổ (0-24)
- `variant`: 'elevation', 'outlined'
- `square`: Boolean (bỏ border radius)

**Ví dụ từ dự án** (`src/components/common/LoggedInView.js`):

```jsx
<Paper
  elevation={6}
  sx={{
    p: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 3,
  }}
>
  {/* Content */}
</Paper>
```

---

## Navigation Components

### AppBar

**Công dụng**: Tạo thanh điều hướng cấp cao cho ứng dụng.

**Props phổ biến:**

- `position`: 'fixed', 'absolute', 'sticky', 'static', 'relative'
- `color`: 'default', 'primary', 'secondary', 'transparent', 'inherit'
- `elevation`: Mức độ bóng đổ (0-24)

**Ví dụ từ dự án** (`src/components/common/Header.js`):

```jsx
<AppBar position="static">
  <Toolbar>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      Gender Healthcare
    </Typography>
    <Button color="inherit">Login</Button>
  </Toolbar>
</AppBar>
```

### Toolbar

**Công dụng**: Container cho nội dung trong AppBar, cung cấp padding và alignment phù hợp.

**Ví dụ từ dự án** (`src/components/common/Header.js`):

```jsx
<AppBar position="static">
  <Toolbar>
    <IconButton color="inherit" edge="start">
      <AccountCircleIcon />
    </IconButton>
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      App Title
    </Typography>
    <Button color="inherit">Login</Button>
  </Toolbar>
</AppBar>
```

### Menu & MenuItem

**Công dụng**: Tạo dropdown menu với các option.

**Props phổ biến:**

- `anchorEl`: Element để gắn menu
- `open`: Boolean (trạng thái mở/đóng)
- `onClose`: Callback khi menu đóng

**Ví dụ từ dự án** (`src/components/common/Header.js`):

```jsx
const [anchorEl, setAnchorEl] = useState(null);

<IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
  <AccountCircleIcon />
</IconButton>

<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={() => setAnchorEl(null)}
>
  <MenuItem onClick={handleProfile}>Profile</MenuItem>
  <MenuItem onClick={handleLogout}>Logout</MenuItem>
</Menu>
```

### Drawer

**Công dụng**: Tạo panel trượt từ cạnh màn hình, thường dùng cho menu.

**Props phổ biến:**

- `open`: Boolean (kiểm soát trạng thái mở)
- `anchor`: 'left', 'right', 'top', 'bottom'
- `variant`: 'permanent', 'persistent', 'temporary'
- `onClose`: Callback khi drawer đóng

**Ví dụ:**

```jsx
<Drawer anchor="left" open={open} onClose={handleClose}>
  <List>
    <ListItem button onClick={() => navigate("/home")}>
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem>
    {/* Thêm các menu items khác */}
  </List>
</Drawer>
```

### Tabs

**Công dụng**: Tạo giao diện tabs để chuyển đổi giữa các views.

**Props phổ biến:**

- `value`: Giá trị của tab hiện tại
- `onChange`: Callback khi tab thay đổi
- `indicatorColor`, `textColor`: 'primary', 'secondary', 'inherit'
- `variant`: 'standard', 'fullWidth', 'scrollable'
- `orientation`: 'horizontal', 'vertical'

**Ví dụ:**

```jsx
const [value, setValue] = useState(0);

<Tabs value={value} onChange={(e, newValue) => setValue(newValue)}>
  <Tab label="Item One" />
  <Tab label="Item Two" />
  <Tab label="Item Three" />
</Tabs>;

{
  /* Tab panels */
}
{
  value === 0 && <TabPanel>Content 1</TabPanel>;
}
{
  value === 1 && <TabPanel>Content 2</TabPanel>;
}
{
  value === 2 && <TabPanel>Content 3</TabPanel>;
}
```

### BottomNavigation

**Công dụng**: Tạo thanh điều hướng phía dưới cho mobile apps.

**Props phổ biến:**

- `value`: Giá trị hiện tại
- `onChange`: Callback khi item được chọn
- `showLabels`: Boolean (hiển thị nhãn)

**Ví dụ:**

```jsx
const [value, setValue] = useState(0);

<BottomNavigation
  value={value}
  onChange={(event, newValue) => {
    setValue(newValue);
  }}
>
  <BottomNavigationAction label="Home" icon={<HomeIcon />} />
  <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
  <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
</BottomNavigation>;
```

---

## Feedback Components

### Dialog

**Công dụng**: Tạo hộp thoại modal hiển thị trên nội dung hiện tại.

**Props phổ biến:**

- `open`: Boolean (kiểm soát trạng thái mở)
- `onClose`: Callback khi dialog đóng
- `fullWidth`: Boolean
- `maxWidth`: 'xs', 'sm', 'md', 'lg', 'xl'

**Ví dụ:**

```jsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Dialog</Button>
<Dialog open={open} onClose={() => setOpen(false)}>
  <DialogTitle>Dialog Title</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Dialog content goes here.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={handleConfirm} variant="contained">Confirm</Button>
  </DialogActions>
</Dialog>
```

### Snackbar

**Công dụng**: Hiển thị thông báo ngắn ở phía dưới màn hình.

**Props phổ biến:**

- `open`: Boolean (kiểm soát trạng thái mở)
- `autoHideDuration`: Thời gian tự động đóng (ms)
- `onClose`: Callback khi snackbar đóng
- `message`: Nội dung thông báo
- `action`: Action component (thường là nút đóng)

**Ví dụ:**

```jsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Show Snackbar</Button>
<Snackbar
  open={open}
  autoHideDuration={6000}
  onClose={() => setOpen(false)}
  message="Note archived"
  action={
    <IconButton size="small" color="inherit" onClick={() => setOpen(false)}>
      <CloseIcon fontSize="small" />
    </IconButton>
  }
/>
```

### CircularProgress

**Công dụng**: Hiển thị vòng loading quay tròn.

**Props phổ biến:**

- `size`: Kích thước (px)
- `thickness`: Độ dày của vòng tròn
- `color`: 'primary', 'secondary', 'inherit'
- `variant`: 'determinate', 'indeterminate'
- `value`: Giá trị tiến trình (0-100) khi variant="determinate"

**Ví dụ:**

```jsx
// Indeterminate
<CircularProgress />

// Determinate
<CircularProgress variant="determinate" value={75} />
```

---

## Inputs & Controls

### Button

**Công dụng**: Tạo nút tương tác.

**Props phổ biến:**

- `variant`: 'contained', 'outlined', 'text'
- `color`: 'primary', 'secondary', 'success', 'error', 'info', 'warning', 'inherit'
- `size`: 'small', 'medium', 'large'
- `disabled`: Boolean
- `startIcon`, `endIcon`: Icon ở đầu/cuối
- `fullWidth`: Boolean (chiếm toàn bộ chiều rộng container)
- `onClick`: Callback khi nút được nhấn

**Ví dụ từ dự án** (`src/components/pages/RegisterPage.js`):

```jsx
<Button
  variant="contained"
  onClick={sendVerificationCode}
  disabled={isCodeButtonDisabled}
  fullWidth
  sx={{
    height: 56,
    fontWeight: "bold",
    borderRadius: 2,
    background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
    textTransform: "none",
  }}
>
  {isCodeButtonDisabled ? `Gửi lại sau (${countdown}s)` : "Gửi mã"}
</Button>
```

### IconButton

**Công dụng**: Tạo nút chỉ chứa icon, thường dùng cho các action nhỏ.

**Props phổ biến:**

- `size`: 'small', 'medium', 'large'
- `color`: 'default', 'inherit', 'primary', 'secondary', etc.
- `edge`: 'start', 'end', false
- `disabled`: Boolean

**Ví dụ từ dự án** (`src/components/pages/LoginPage.js`):

```jsx
<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
</IconButton>
```

### TextField

**Công dụng**: Tạo input field với nhiều variant.

**Props phổ biến:**

- `variant`: 'outlined', 'filled', 'standard'
- `label`: Nhãn hiển thị
- `value`: Giá trị hiện tại
- `onChange`: Callback khi giá trị thay đổi
- `type`: 'text', 'password', 'email', 'number', etc.
- `multiline`: Boolean (cho phép nhiều dòng)
- `rows`: Số dòng hiển thị khi multiline=true
- `required`: Boolean
- `disabled`: Boolean
- `error`: Boolean
- `helperText`: Text hiển thị dưới input (gợi ý hoặc lỗi)
- `InputProps`: Props cho component Input bên trong

**Ví dụ từ dự án** (`src/components/pages/LoginPage.js`):

```jsx
<TextField
  label="Email hoặc Username"
  variant="outlined"
  type="text"
  value={formData.email}
  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  required
  fullWidth
  error={!!error}
  helperText={error}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <PersonIcon sx={{ color: theme.palette.primary.main }} />
      </InputAdornment>
    ),
  }}
/>
```

### InputAdornment

**Công dụng**: Thêm icon hoặc text vào đầu/cuối TextField.

**Props phổ biến:**

- `position`: 'start', 'end'

**Ví dụ từ dự án** (`src/components/pages/RegisterPage.js`):

```jsx
<TextField
  label="Email"
  type="email"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <AlternateEmailIcon sx={{ color: theme.palette.primary.main }} />
      </InputAdornment>
    ),
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={handleEmailVerification} edge="end">
          <VerifiedUserIcon />
        </IconButton>
      </InputAdornment>
    ),
  }}
/>
```

### Select

**Công dụng**: Tạo dropdown selection.

**Props phổ biến:**

- `value`: Giá trị hiện tại
- `onChange`: Callback khi giá trị thay đổi
- `label`: Khi được sử dụng với FormControl và InputLabel
- `multiple`: Boolean (cho phép chọn nhiều)
- `displayEmpty`: Boolean (hiển thị item rỗng)
- `renderValue`: Function xử lý hiển thị giá trị đã chọn

**Ví dụ:**

```jsx
const [age, setAge] = useState("");

<FormControl fullWidth>
  <InputLabel id="age-select-label">Age</InputLabel>
  <Select
    labelId="age-select-label"
    value={age}
    label="Age"
    onChange={(e) => setAge(e.target.value)}
  >
    <MenuItem value="">
      <em>None</em>
    </MenuItem>
    <MenuItem value={10}>Ten</MenuItem>
    <MenuItem value={20}>Twenty</MenuItem>
    <MenuItem value={30}>Thirty</MenuItem>
  </Select>
</FormControl>;
```

### Checkbox & Radio

**Công dụng**: Tạo checkbox và radio button.

**Props phổ biến:**

- `checked`: Boolean (trạng thái check)
- `onChange`: Callback khi trạng thái thay đổi
- `color`: 'primary', 'secondary', etc.
- `disabled`: Boolean
- `size`: 'small', 'medium'

**Ví dụ:**

```jsx
// Checkbox
const [checked, setChecked] = useState(false);

<FormControlLabel
  control={
    <Checkbox
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  }
  label="I agree to terms and conditions"
/>;

// Radio
const [value, setValue] = useState("female");

<RadioGroup value={value} onChange={(e) => setValue(e.target.value)}>
  <FormControlLabel value="female" control={<Radio />} label="Female" />
  <FormControlLabel value="male" control={<Radio />} label="Male" />
  <FormControlLabel value="other" control={<Radio />} label="Other" />
</RadioGroup>;
```

### Switch

**Công dụng**: Tạo toggle switch.

**Props phổ biến:**

- `checked`: Boolean (trạng thái bật/tắt)
- `onChange`: Callback khi trạng thái thay đổi
- `color`: 'primary', 'secondary', etc.
- `size`: 'small', 'medium'
- `disabled`: Boolean

**Ví dụ:**

```jsx
const [on, setOn] = useState(false);

<FormControlLabel
  control={
    <Switch
      checked={on}
      onChange={(e) => setOn(e.target.checked)}
      color="primary"
    />
  }
  label="Enable notifications"
/>;
```

### DatePicker

**Công dụng**: Tạo date picker (yêu cầu @mui/x-date-pickers).

**Props phổ biến:**

- `value`: Giá trị ngày đã chọn
- `onChange`: Callback khi ngày thay đổi
- `renderInput`: Function render input field
- `disableFuture`: Boolean
- `disablePast`: Boolean
- `minDate`, `maxDate`: Giới hạn phạm vi ngày

**Cài đặt:**

```bash
npm install @mui/x-date-pickers date-fns
```

**Ví dụ:**

```jsx
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const [date, setDate] = useState(null);

<LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker
    label="Select Date"
    value={date}
    onChange={(newValue) => {
      setDate(newValue);
    }}
    renderInput={(params) => <TextField {...params} />}
  />
</LocalizationProvider>;
```

---

## Data Display

### Typography

**Công dụng**: Hiển thị văn bản một cách nhất quán với các style định sẵn.

**Props phổ biến:**

- `variant`: 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'button', 'caption', 'overline'
- `component`: HTML/React element để render (h1, h2, p, span, div,...)
- `align`: 'left', 'center', 'right', 'justify'
- `color`: 'primary', 'secondary', 'error', 'textPrimary', 'textSecondary', etc.
- `gutterBottom`: Boolean (thêm margin-bottom)
- `noWrap`: Boolean (prevent text wrapping)

**Ví dụ từ dự án** (`src/components/pages/HomePage.js`):

```jsx
<Typography variant="h2" align="center" gutterBottom>
  Welcome to Gender Healthcare
</Typography>

<Typography variant="subtitle1" align="center" paragraph>
  Comprehensive healthcare services for all gender identities
</Typography>
```

### Card

**Công dụng**: Tạo surface chứa nội dung và hành động liên quan đến một chủ đề.

**Components liên quan:**

- `Card`: Container chính
- `CardHeader`: Header với title, subheader, avatar
- `CardContent`: Nội dung chính
- `CardMedia`: Hiển thị image/video
- `CardActions`: Container cho buttons/actions

**Ví dụ từ dự án** (`src/components/pages/HomePage.js`):

```jsx
<Card
  sx={{
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "0.3s",
    "&:hover": { transform: "translateY(-8px)" },
  }}
>
  <CardMedia
    component="img"
    height="140"
    image={`https://source.unsplash.com/random/300×200/?health&sig=${item}`}
    alt={`Service ${item}`}
  />
  <CardContent sx={{ flexGrow: 1 }}>
    <Typography gutterBottom variant="h5" component="h3">
      Service {item}
    </Typography>
    <Typography>This is a description for the health service.</Typography>
  </CardContent>
</Card>
```

### CardContent & CardMedia

**CardContent**: Container cho nội dung text trong Card.
**CardMedia**: Hiển thị media (image, video) trong Card.

**Ví dụ từ dự án** (`src/components/pages/RegisterPage.js`):

```jsx
<Card elevation={8} sx={{ borderRadius: 4, overflow: "hidden" }}>
  <CardContent sx={{ p: 4 }}>
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Avatar
        sx={{
          width: 80,
          height: 80,
          mx: "auto",
          mb: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        }}
      >
        <VerifiedUserIcon sx={{ fontSize: 40, color: "white" }} />
      </Avatar>
      <Typography variant="h4" component="h1" fontWeight="bold">
        Đăng Ký Tài Khoản
      </Typography>
    </Box>
  </CardContent>
</Card>
```

### Avatar

**Công dụng**: Hiển thị avatar (hình ảnh đại diện).

**Props phổ biến:**

- `src`: URL của hình ảnh
- `alt`: Text thay thế khi ảnh không load được
- `variant`: 'circular' (mặc định), 'rounded', 'square'
- `sx`: Customize styles (kích thước, màu sắc, etc.)
- `children`: Nội dung hiển thị khi không có src (thường là ký tự hoặc icon)

**Ví dụ từ dự án** (`src/components/pages/RegisterPage.js`):

```jsx
// Icon Avatar với gradient background
<Avatar
  sx={{
    width: 80,
    height: 80,
    mx: "auto",
    mb: 2,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  }}
>
  <VerifiedUserIcon sx={{ fontSize: 40, color: "white" }} />
</Avatar>
```

### Badge

**Công dụng**: Hiển thị badge nhỏ ở góc component (thường dùng cho thông báo).

**Props phổ biến:**

- `badgeContent`: Nội dung hiển thị trong badge
- `color`: 'primary', 'secondary', 'error', 'warning', 'info', 'success'
- `max`: Giá trị tối đa hiển thị (vượt quá sẽ hiển thị "+")
- `variant`: 'standard', 'dot'
- `invisible`: Boolean (ẩn/hiện badge)
- `overlap`: 'rectangular', 'circular'

**Ví dụ:**

```jsx
// Badge với số
<Badge badgeContent={4} color="primary">
  <MailIcon />
</Badge>

// Badge dạng dot
<Badge variant="dot" color="error">
  <NotificationsIcon />
</Badge>
```

---

## Utils & Styling

### alpha

**Công dụng**: Utility function để thêm transparency cho màu sắc.

**Ví dụ từ dự án** (`src/components/pages/RegisterPage.js`):

```jsx
import { alpha } from "@mui/material";

<Box
  sx={{
    background: `linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  }}
>
```

### useTheme

**Công dụng**: Hook để truy cập theme object trong component.

**Ví dụ từ dự án** (`src/components/pages/LoginPage.js`):

```jsx
import { useTheme } from "@mui/material";

const MyComponent = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }}
    >
      Content
    </Box>
  );
};
```

### CssBaseline

**Công dụng**: Reset CSS toàn cục và áp dụng Material Design baseline styles.

**Ví dụ từ dự án** (`src/App.js`):

```jsx
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* App content */}
    </ThemeProvider>
  );
}
```

### styled API

**Công dụng**: Tạo component với style tùy chỉnh (tương tự styled-components).

**Ví dụ từ dự án** (`src/components/pages/RegisterPage.js`):

```jsx
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  height: 48,
  padding: "0 30px",
}));
```

---

## Icons

**Cài đặt**: `@mui/icons-material`

**Icons đã sử dụng trong dự án:**

```jsx
// Authentication & User
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";

// Security & Verification
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Communication
import EmailIcon from "@mui/icons-material/Email";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

// Navigation
import HomeIcon from "@mui/icons-material/Home";
```

**Cách sử dụng:**

```jsx
// Trong TextField
<TextField
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <PersonIcon sx={{ color: theme.palette.primary.main }} />
      </InputAdornment>
    ),
  }}
/>

// Trong Button
<Button startIcon={<LoginIcon />}>
  Đăng nhập
</Button>

// Trong Avatar
<Avatar>
  <LockOutlinedIcon />
</Avatar>
```

---

## Examples từ Dự Án

### Login Form Pattern

**File**: `src/components/pages/LoginPage.js`

```jsx
<Container maxWidth="md">
  <Card elevation={8} sx={{ borderRadius: 4, overflow: "hidden" }}>
    <CardContent sx={{ p: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}>
          <LockOutlinedIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Đăng Nhập
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Email hoặc Username"
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<LoginIcon />}
            sx={{ mt: 2, py: 1.5 }}
          >
            Đăng Nhập
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
</Container>
```

### Header với Menu Pattern

**File**: `src/components/common/Header.js`

```jsx
<AppBar position="static">
  <Container maxWidth="lg">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Gender Healthcare
      </Typography>

      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <AccountCircleIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleProfile}>
          <PersonIcon sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </Toolbar>
  </Container>
</AppBar>
```

### Responsive Grid Layout

**File**: `src/components/pages/HomePage.js`

```jsx
<Container maxWidth="lg" sx={{ py: 8 }}>
  <Typography variant="h2" align="center" gutterBottom>
    Our Services
  </Typography>

  <Grid container spacing={4} sx={{ mt: 4 }}>
    {services.map((service, index) => (
      <Grid item key={index} xs={12} sm={6} md={4}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "0.3s",
            "&:hover": { transform: "translateY(-8px)" },
          }}
        >
          <CardMedia
            component="img"
            height="140"
            image={service.image}
            alt={service.title}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h3">
              {service.title}
            </Typography>
            <Typography>{service.description}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Container>
```

---

## Templates & Patterns

### Layout Patterns

**Dashboard Layout:**

```jsx
<Box sx={{ display: "flex" }}>
  {/* Sidebar */}
  <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
    <Toolbar />
    <Box sx={{ overflow: "auto" }}>
      <List>{/* list items */}</List>
    </Box>
  </Drawer>

  {/* Main content */}
  <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
    <Toolbar /> {/* Provides spacing below AppBar */}
    <Typography paragraph>Content goes here...</Typography>
  </Box>
</Box>
```

**Sign-in Form:**

```jsx
<Container component="main" maxWidth="xs">
  <Box
    sx={{
      marginTop: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
      <LockOutlinedIcon />
    </Avatar>
    <Typography component="h1" variant="h5">
      Sign in
    </Typography>
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
      />
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Remember me"
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign In
      </Button>
    </Box>
  </Box>
</Container>
```

---

## Styling trong Material UI

### 1. sx prop

**Công dụng**: Cách nhanh nhất để style một component.

```jsx
<Box
  sx={{
    bgcolor: "background.paper",
    boxShadow: 1,
    borderRadius: 2,
    p: 2,
    minWidth: 300,
  }}
>
  Content
</Box>
```

### 2. styled API

**Công dụng**: Tạo component với style tùy chỉnh (tương tự styled-components).

```jsx
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  height: 48,
  padding: "0 30px",
  margin: theme.spacing(1),
}));

// Sử dụng
<StyledButton>Custom Button</StyledButton>;
```

### 3. Theme Customization

**Công dụng**: Tùy chỉnh theme toàn cục cho ứng dụng.

```jsx
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#9c27b0",
    },
    error: {
      main: "#d32f2f",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
    },
  },
  spacing: 8, // Define base spacing unit (8px)
  shape: {
    borderRadius: 4, // Default border radius
  },
  components: {
    // Override component styles
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>;
```

---

## Mẹo sử dụng Material UI hiệu quả

1. **Tận dụng theme**: Sử dụng theme cho màu sắc, spacing để đảm bảo UI nhất quán

2. **Responsive design**: Sử dụng breakpoints của Material UI

   ```jsx
   <Box sx={{
     width: {
       xs: '100%', // 0px+
       sm: '80%',  // 600px+
       md: '60%',  // 900px+
       lg: '40%',  // 1200px+
       xl: '30%',  // 1536px+
     }
   }}>
   ```

3. **Custom hooks**: Tái sử dụng logic UI phức tạp

   ```jsx
   function useFormField(initialValue = "") {
     const [value, setValue] = useState(initialValue);
     const [error, setError] = useState(null);

     return {
       value,
       error,
       onChange: (e) => setValue(e.target.value),
       setError,
       reset: () => setValue(initialValue),
     };
   }
   ```

4. **Composition over configuration**: Chia UI thành các component nhỏ, tái sử dụng

5. **Hiểu hệ thống spacing**: Material UI sử dụng hệ số 8px (1 = 8px, 2 = 16px,...)

6. **Sử dụng Portal**: Cho modals, tooltips và poppers để render bên ngoài container hiện tại

   ```jsx
   import { Portal } from "@mui/base";

   <Portal container={document.body}>
     <SomeModal />
   </Portal>;
   ```

---

## Tóm tắt Components đã sử dụng trong Dự án

### Layout:

✅ Container, Box, Grid, Paper

### Navigation:

✅ AppBar, Toolbar, Menu, MenuItem

### Input & Controls:

✅ TextField, Button, IconButton, InputAdornment

### Data Display:

✅ Typography, Avatar, Card, CardContent, CardMedia

### Utils & Styling:

✅ alpha, useTheme, CssBaseline, styled

### Theme:

✅ createTheme, ThemeProvider

### Icons (11 icons):

✅ LockOutlined, VerifiedUser, Email, Person, AccountCircle, VpnKey, AlternateEmail, Home, Visibility, VisibilityOff, Login

---

## Tài nguyên học tập

1. [Trang chủ Material UI](https://mui.com/)
2. [Tài liệu chính thức](https://mui.com/material-ui/getting-started/)
3. [Component API Reference](https://mui.com/material-ui/api/accordion/)
4. [GitHub repository](https://github.com/mui/material-ui)
5. [Templates](https://mui.com/material-ui/getting-started/templates/)

---

_Tài liệu được tạo: Tháng 05, 2025_  
_Cập nhật cuối: Tháng 06, 2025 - Thêm các components từ codebase thực tế_
