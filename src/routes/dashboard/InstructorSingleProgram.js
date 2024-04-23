import { v4 as uuid } from 'uuid';

export const SingleProgram = [
  {
    id: uuid(),
    link: '/i/programs/single/overview',
    name: 'Courses',
  },
  {
    id: uuid(),
    link: '/i/programs/single/enrollments',
    name: 'Enrollments',
  },
  {
    id: uuid(),
    link: '/i/programs/single/fee',
    name: 'Fee Statistics',
  },
  {
    id: uuid(),
    link: '/i/programs/single/attendance',
    name: 'Attendance',
  },
  {
    id: uuid(),
    link: '/i/programs/single/settings',
    name: 'Program Settings',
  },
];

export default SingleProgram;
