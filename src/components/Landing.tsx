import React from 'react';
import { Token } from './AuthCheck';
import MaterialTable from 'material-table';

import MarkAttendance from './MarkAttendance';

import useFetch from './data/Fetch';
import useRefresh from './data/Refresh';
import Open from './data/Open';

import DeleteForever from '@material-ui/icons/DeleteForever';
import Add from '@material-ui/icons/AddRounded';
import Refresh from '@material-ui/icons/RefreshRounded';

import moment from 'moment';

export default function Landing() {
   const [attendance, setAttendance] = React.useState<
      Array<{
         subject: string;
         date: Date;
         start: string;
         end: string;
         uuid: string;
         attendanceType: string;
      }>
   >([]);
   const [subjects, setSubjects] = React.useState<string[]>([]);
   React.useEffect(() => {
      async function PerformAsync() {
         try {
            const results = await sendRequest(`subjects`);
            setSubjects(
               Array.from(
                  new Set<string>([...subjects, ...results])
               )
            );
         } catch (err) {
            console.error(err);
         }
      }
      PerformAsync();
   }, []);

   const { sendRequest } = useFetch();
   const { refresh, refreshNow } = useRefresh();
   const { isOpen, open: OpenDialogAtt, close: closeDialogAtt } = Open();
   const counter: {
      [key: string]: { [key: string]: number };
   } = {};
   React.useEffect(() => {
      async function PerformAsync() {
         console.log(await Token());
         try {
            const AttendanceTypeMap: any = {};
            AttendanceTypeMap['A'] = 'Absent';
            AttendanceTypeMap['P'] = 'Present';
            AttendanceTypeMap['N'] = 'No lecture';

            let records = await sendRequest(`attendance`);
            console.log(records);

            for (const { subject, attendanceType } of records) {
               if (counter[subject] == null) counter[subject] = {};
               // Count Present/Absent records
               counter[subject][attendanceType] =
                  (counter[subject][attendanceType] || 0) + 1;
               // Count Subject Total attendance
               counter[subject].Total = (counter[subject].Total || 0) + 1;
            }
            setSubjects(
               Array.from(
                  new Set<string>([
                     // Existing Subjects
                     ...subjects,
                     // Get list of all obtained subjects
                     ...Object.keys(counter)
                  ])
               )
            );
            console.log(counter);
            records = records.map(
               ({
                  subject,
                  date,
                  start,
                  end,
                  uuid,
                  attendanceType
               }: {
                  subject: string;
                  date: Date;
                  start: string;
                  end: string;
                  uuid: string;
                  attendanceType: string;
               }) => ({
                  subject,
                  date: new Date(date),
                  start: moment(start, 'hh:mm').toDate(),
                  end: moment(end, 'hh:mm').toDate(),
                  uuid,
                  attendanceType: `${AttendanceTypeMap[attendanceType]} ${
                     // Calculate Attendance Percentage
                     (counter[subject][attendanceType] /
                        counter[subject].Total) *
                     100
                  }`
               })
            );
            setAttendance(records);
         } catch (err) {
            console.error(err);
         }
      }
      PerformAsync();
   }, [refresh]);
   return (
      <>
         <MarkAttendance
            open={isOpen}
            onClose={closeDialogAtt}
            subjects={subjects}
            onSubmit={async result => {
               console.log(JSON.stringify(result));
               await sendRequest('attendance', 'POST', JSON.stringify(result), {
                  'Content-Type': 'Application/json'
               });
               refreshNow();
            }}
         />
         <MaterialTable
            title="Attendance Records"
            data={attendance}
            columns={[
               {
                  title: 'Subject',
                  field: 'subject',
                  type: 'string',
                  defaultGroupOrder: 0,
                  groupTitle: 'Subjects'
               },
               {
                  title: 'Attendance',
                  field: 'attendanceType',
                  defaultGroupOrder: 1,
                  render: attendance => attendance
               },
               {
                  title: 'Date',
                  field: 'date',
                  type: 'date',
                  render: date => moment(date.date || date).format('LL')
               },
               {
                  title: 'Start',
                  field: 'start',
                  type: 'time',
                  render: start => moment(start.start).format('LT')
               },
               {
                  title: 'End',
                  field: 'end',
                  type: 'time',
                  render: end => moment(end.end).format('LT')
               }
            ]}
            actions={[
               {
                  icon: DeleteForever,
                  tooltip: 'Delete attendance record',
                  onClick: async (_, data) => {
                     const { uuid } = Array.isArray(data) ? data[0] : data;
                     await sendRequest(`attendance/${uuid}`, 'DELETE');
                     refreshNow();
                  },
                  position: 'row'
               },
               {
                  icon: Add,
                  position: 'toolbar',

                  tooltip: 'Add attendance record',
                  onClick: (_, __) => {
                     OpenDialogAtt();
                  }
               },
               {
                  icon: Refresh,
                  position: 'toolbar',
                  tooltip: 'Refresh',
                  onClick: (_, __) => refreshNow()
               }
            ]}
            options={{
               grouping: true,
               addRowPosition: 'first',
               rowStyle: {
                  backgroundColor: '#EEE'
               },
               paging: false,
               // Set actions to last index
               actionsColumnIndex: -1
            }}
         />
      </>
   );
}
