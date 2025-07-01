import React, { useState } from "react";
import { Box, Button, TextField, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  dialogTitle: {
    fontWeight: 'bold',
    fontSize: '1.3rem',
    textAlign: 'center',
    color: '#E91E63',
    letterSpacing: 1,
    marginBottom: 8,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minWidth: 350,
    paddingTop: 8,
  },
  textField: {
    background: '#fafafa',
    borderRadius: 6,
  },
  actions: {
    justifyContent: 'space-between',
    padding: '16px 24px',
  },
  saveButton: {
    background: 'linear-gradient(90deg, #E91E63 0%, #9C27B0 100%)',
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: 6,
    padding: '8px 24px',
    boxShadow: '0 2px 8px rgba(233,30,99,0.08)',
    '&:hover': {
      background: 'linear-gradient(90deg, #D81B60 0%, #7B1FA2 100%)',
    },
  },
  cancelButton: {
    color: '#888',
    fontWeight: 500,
  },
  checkboxLabel: {
    marginLeft: 0,
    marginTop: 8,
  },
});

const MenstrualCycleForm = ({ open, onClose, onSubmit }) => {
  const classes = useStyles();
  const [form, setForm] = useState({
    startDate: "",
    numberOfDays: "",
    cycleLength: "",
    reminderEnabled: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      numberOfDays: Number(form.numberOfDays),
      cycleLength: Number(form.cycleLength),
    });
    setForm({
      startDate: "",
      numberOfDays: "",
      cycleLength: "",
      reminderEnabled: false,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className={classes.dialogTitle}>Ghi nhận chu kỳ mới</DialogTitle>
      <form onSubmit={handleSubmit} className={classes.form}>
        <DialogContent>
          <TextField
            label="Ngày bắt đầu chu kỳ"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
            margin="normal"
            className={classes.textField}
          />
          <TextField
            label="Số ngày hành kinh"
            type="number"
            name="numberOfDays"
            value={form.numberOfDays}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ min: 1 }}
            className={classes.textField}
          />
          <TextField
            label="Độ dài chu kỳ"
            type="number"
            name="cycleLength"
            value={form.cycleLength}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ min: 1 }}
            className={classes.textField}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.reminderEnabled}
                onChange={handleChange}
                name="reminderEnabled"
                color="secondary"
              />
            }
            label="Bật nhắc nhở"
            className={classes.checkboxLabel}
          />
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button onClick={onClose} className={classes.cancelButton}>Hủy</Button>
          <Button type="submit" variant="contained" className={classes.saveButton}>Lưu</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MenstrualCycleForm; 