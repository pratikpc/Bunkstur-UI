import React, { useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import CloseIcon from '@material-ui/icons/CloseRounded';
import MarkIcon from '@material-ui/icons/CheckCircle';
import SubjectIcon from '@material-ui/icons/AssignmentIndRounded';

import InputAdornment from '@material-ui/core/InputAdornment';

import DateFnsUtils from '@date-io/date-fns';
import {
   DatePicker,
   TimePicker,
   MuiPickersUtilsProvider
} from '@material-ui/pickers';

export default function MarkAttendance({
   open,
   onClose,
   onSubmit,
   subjects
}: {
   open: boolean;
   subjects: string[];
   onClose: () => void;
   onSubmit: (result: {
      subject: string;
      date: string;
      start: string;
      end: string;
      attendanceType: string;
   }) => Promise<void>;
}) {
   const [subjectSelected, setSubject] = useState(subjects[0] || '');
   const [attendanceType, setStatus] = useState('P');
   const [date, setDate] = useState(new Date());
   const [startTime, setStartTime] = useState(new Date());
   const [endTime, setEndTime] = useState(new Date());

   return (
      <Dialog open={open} scroll="body" aria-labelledby="form-dialog-title">
         <DialogTitle>Mark attendance</DialogTitle>
         <CssBaseline />
         <AppBar
            style={{ backgroundColor: '#3f51b5', maxHeight: '8vh' }}
            position="static"
         >
            <Toolbar>
               <IconButton
                  edge="start"
                  color="inherit"
                  onClick={onClose}
                  aria-label="close"
               >
                  <CloseIcon />
               </IconButton>
            </Toolbar>
         </AppBar>
         <DialogContent>
            <form
               id="attendance-form"
               onSubmit={async event => {
                  const result = {
                     subject: subjectSelected,
                     attendanceType,
                     date: date.toLocaleDateString('en-CA'), // yyyy-mm-dd // Hack. JS needs better ways to format
                     start: startTime
                        .toLocaleTimeString('en-GB') // hh:mm:ss
                        .substr(0, 5), // hh:mm
                     end: endTime
                        .toLocaleTimeString('en-GB') // hh:mm:ss
                        .substr(0, 5) // hh:mm
                  };
                  event.preventDefault();
                  await onSubmit(result);
                  onClose();
                  return false;
               }}
            >
               <DialogContentText>Subject</DialogContentText>
               <Autocomplete
                  freeSolo
                  aria-required={'true'}
                  options={subjects}
                  autoHighlight
                  value={subjectSelected}
                  onInputChange={(_, value) => {
                     setSubject((value || '').trim());
                  }}
                  renderInput={(params: any) => (
                     <TextField
                        {...params}
                        label="Select subject"
                        variant="outlined"
                        required
                        inputProps={{
                           ...params.inputProps
                        }}
                     />
                  )}
               />
               <DialogContentText>Type</DialogContentText>
               <TextField
                  select
                  id="attType"
                  label="Attendance type"
                  required
                  aria-required={'true'}
                  value={attendanceType}
                  variant="outlined"
                  onChange={({ target: { value } }) => setStatus(value)}
                  helperText="Select attendance type"
               >
                  <MenuItem key="A" value="A">
                     {'Absent'}
                  </MenuItem>
                  <MenuItem key="P" value="P" selected>
                     {'Present'}
                  </MenuItem>
                  <MenuItem key="N" value="N">
                     {'No lecture'}
                  </MenuItem>
               </TextField>

               <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DialogContentText>Date</DialogContentText>
                  <DatePicker
                     id="date"
                     label="Date"
                     value={date}
                     clearable
                     required
                     onChange={setDate}
                     helperText="Choose date"
                  />

                  <DialogContentText>Start time</DialogContentText>
                  <TimePicker
                     id="start"
                     label="Start time"
                     value={startTime}
                     required
                     clearable
                     minutesStep={5}
                     onChange={start => {
                        if (start == null) {
                           setStartTime(start);
                           return;
                        }
                        if (endTime != null && start >= endTime) {
                           start = null;
                        }
                        setStartTime(start);
                     }}
                     helperText="Choose start time"
                  />

                  <DialogContentText>End time</DialogContentText>
                  <TimePicker
                     id="end"
                     label="End time"
                     value={endTime}
                     required
                     clearable
                     minutesStep={5}
                     onChange={end => {
                        if (end == null) {
                           setEndTime(end);
                           return;
                        }
                        if (startTime != null && end <= startTime) {
                           end = null;
                        }
                        setEndTime(end);
                     }}
                     helperText="Choose end time"
                  />
               </MuiPickersUtilsProvider>
            </form>
         </DialogContent>
         <DialogActions>
            <IconButton
               type="submit"
               form="attendance-form"
               //    onClick={() => {
               //       console.log(
               //          'hu',
               //          subjectSelected,
               //          date,
               //          attendanceType,
               //          startTime,
               //          endTime
               //       );
               //       if (
               //          subjectSelected === '' ||
               //          date == null ||
               //          attendanceType === '' ||
               //          startTime == null ||
               //          endTime == null
               //       )
               //          return;
               //       console.log(
               //          'hue',
               //          subjectSelected,
               //          date,
               //          attendanceType,
               //          startTime,
               //          endTime
               //       );
               //    }}
            >
               <MarkIcon color="primary" />
               Mark
            </IconButton>
         </DialogActions>
      </Dialog>
   );
}
