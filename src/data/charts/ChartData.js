/** Traffic Chart Series and options used in Dashboard Overview page  */
export const TrafficChartSeries = [44, 55, 41];
export const TrafficChartOptions = {
	dataLabels: { enabled: !1 },
	labels: ['Direct', 'Referral', 'Organic'],
	colors: ['#754FFE', '#CEC0FF', '#E8E2FF'],
	legend: { position: 'bottom' },
	plotOptions: { pie: { expandOnClick: !1, donut: { size: '78%' } } },
	chart: { type: 'donut' },
	tooltip: { theme: 'light', marker: { show: !0 }, x: { show: !1 } },
	states: { hover: { filter: { type: 'none' } } },
	responsive: [
		{
			breakpoint: 480,
			options: {
				chart: {
					height: 300
				}
			}
		},
		{
			breakpoint: 5000,
			options: {
				chart: {
					height: 280
				}
			}
		}
	]
};

/** Earnings Chart Series and options used in Dashboard Overview page  */

export const EarningsChartSeries = [
	{
		name: 'Hours',
		data: [1.4, 2.8, 2.2, 1, 5, 1, 8]
	}
];
export const EarningsChartOptions = {
	height: 'auto',
	labels: [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	],
	chart: {
		fontFamily: '$font-family-base',
		height: '350px',
		type: 'line',
		toolbar: { show: !1 }
	},
	colors: ['#01BDF2'],
	stroke: { width: 4, curve: 'smooth', colors: ['#1B296D'] },
	dataLabels: {
		enabled: false
	  },
	xaxis: {
		axisBorder: { show: !1 },
		axisTicks: { show: !1 },
		crosshairs: { show: !0 },
		labels: {
			offsetX: 0,
			offsetY: 5,
			style: { fontSize: '13px', fontWeight: 400, colors: '#a8a3b9' }
		}
	},
	yaxis: {
		labels: {
			formatter: function (e) {
					
				return e;
			},
			style: { fontSize: '13px', fontWeight: 400, colors: '#a8a3b9' },
			offsetX: -15
		},
		tickAmount: 5,
		min: 0,
		max: 10
	},
	grid: {
		borderColor: '#e0e6ed',
		strokeDashArray: 5,
		xaxis: { lines: { show: !1 } },
		yaxis: { lines: { show: !0 } },
		padding: { top: 0, right: 0, bottom: 0, left: 0 }
	},
	legend: {
		position: 'top',
		horizontalAlign: 'right',
		offsetY: -50,
		fontSize: '16px',
		markers: {
			width: 10,
			height: 10,
			strokeWidth: 0,
			strokeColor: '#fff',
			fillColors: void 0,
			radius: 12,
			onClick: void 0,
			offsetX: 0,
			offsetY: 0
		},
		itemMargin: { horizontal: 0, vertical: 20 }
	},
	tooltip: { theme: 'light', marker: { show: !0 }, x: { show: !1 } },
	responsive: [
		{
			breakpoint: 480,
			options: {
				chart: {
					height: 300
				}
			}
		},
		{
			breakpoint: 5000,
			options: {
				chart: {
					height: 280
				}
			}
		}
	]
};

export const ProgramAnalysisChartSeries = [
	{
		name: 'Enrolled',
		data: [14, 28, 22, 45, 55, 19, 39]
	}
];
export const ProgramAnalysisChartOptions = {
	height: 'auto',
	labels: [
		'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
	],
	chart: {
		fontFamily: '$font-family-base',
		height: '350px',
		type: 'line',
		toolbar: { show: !1 }
	},
	colors: ['#01BDF2'],
	stroke: { width: 4, curve: 'smooth', colors: ['#1B296D'] },
	dataLabels: {
		enabled: false
	  },
	xaxis: {
		axisBorder: { show: !1 },
		axisTicks: { show: !1 },
		crosshairs: { show: !0 },
		labels: {
			offsetX: 0,
			offsetY: 5,
			style: { fontSize: '13px', fontWeight: 400, colors: '#a8a3b9' }
		}
	},
	yaxis: {
		labels: {
			formatter: function (e) {
					
				return e;
			},
			style: { fontSize: '13px', fontWeight: 400, colors: '#a8a3b9' },
			offsetX: -15
		},
		tickAmount: 5,
		min: 0,
		max: 100
	},
	grid: {
		borderColor: '#e0e6ed',
		strokeDashArray: 5,
		xaxis: { lines: { show: !1 } },
		yaxis: { lines: { show: !0 } },
		padding: { top: 0, right: 0, bottom: 0, left: 0 }
	},
	legend: {
		position: 'top',
		horizontalAlign: 'right',
		offsetY: -50,
		fontSize: '16px',
		markers: {
			width: 10,
			height: 10,
			strokeWidth: 0,
			strokeColor: '#fff',
			fillColors: void 0,
			radius: 12,
			onClick: void 0,
			offsetX: 0,
			offsetY: 0
		},
		itemMargin: { horizontal: 0, vertical: 20 }
	},
	tooltip: { theme: 'light', marker: { show: !0 }, x: { show: !1 } },
	responsive: [
		{
			breakpoint: 480,
			options: {
				chart: {
					height: 300
				}
			}
		},
		{
			breakpoint: 5000,
			options: {
				chart: {
					height: 280
				}
			}
		}
	]
};

/** Session Chart Series and options used in Dashboard Analytics page  */

export const TotalProgramsChartSeries = [4, 2, 2];
export const TotalProgramsChartOptions = {
	 dataLabels: {
		 enabled: false
	 },
	 labels: ['In Progress', 'Complete','Yet to Start'],
	 colors: ['#01b3e5', '#845cbd', '#909090'],
	 chart: {
		 width: 200,
		 type: 'donut'
	 },
	 plotOptions: {
		 pie: {
			 expandOnClick: false,
			 donut: {
				 size: '50%'
			 }
		 }
	 },
	 legend: {
		 position: 'bottom',
		 fontFamily: 'inter',
		 fontWeight: 500,
		 fontSize: '14px',
		 markers: {
			 width: 8,
			 height: 8,
			 strokeWidth: 0,
			 strokeColor: '#fff',
			 fillColors: undefined,
			 radius: 12,
			 customHTML: undefined,
			 onClick: undefined,
			 offsetX: -2,
			 offsetY: 1
		 },
		 itemMargin: {
			 horizontal: 8,
			 vertical: 0
		 }
	 },
	 tooltip: {
		 theme: 'light',
		 marker: {
			 show: true
		 },
		 x: {
			 show: false
		 }
	 },
	 states: {
		 hover: {
			 filter: {
				 type: 'none'
			 }
		 }
	 },
 };

export const OverallProgramsChartSeries = [4, 2, 2];
export const OverallProgramsChartOptions = {
	 dataLabels: {
		 enabled: false
	 },
	 labels: ['Completed', 'In Progress','Upcoming'],
	 colors: ['#754ffe', '#29baf9', '#909090'],
	 chart: {
		 width: 400,
		 type: 'donut'
	 },
	 plotOptions: {
		 pie: {
			 expandOnClick: false,
			 donut: {
				 size: '50%'
			 }
		 }
	 },
	 legend: {
		 position: 'bottom',
		 fontFamily: 'inter',
		 fontWeight: 500,
		 fontSize: '14px',
		 markers: {
			 width: 8,
			 height: 8,
			 strokeWidth: 0,
			 strokeColor: '#fff',
			 fillColors: undefined,
			 radius: 12,
			 customHTML: undefined,
			 onClick: undefined,
			 offsetX: -2,
			 offsetY: 1
		 },
		 itemMargin: {
			 horizontal: 8,
			 vertical: 0
		 }
	 },
	 tooltip: {
		 theme: 'light',
		 marker: {
			 show: true
		 },
		 x: {
			 show: false
		 }
	 },
	 states: {
		 hover: {
			 filter: {
				 type: 'none'
			 }
		 }
	 },
 };

export const WeeklyGoalChartSeries = [
	{
		name: 'Achieved',
		type: 'column',
		data: [12, 18, 2, 8, 4, 9, 14]
	},
	// {
	// 	name: 'Goal',
	// 	type: 'line',
	// 	data: [20, 26, 28, 32, 23, 15, 23]
	// }
 ]
export const WeeklyGoalChartOptions = {
	height: '250',
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: '30%',
			borderRadius: 5
		}
	},
	labels: [
		'Sun',
		'Mon',
		'Tue',
		'Wed',
		'Thur',
		'Fri',
		'Sat'
	],
	chart: {
		fontFamily: '$font-family-base',
		height: '250px',
		type: 'line',
		toolbar: { show: !1 }
	},
	colors: ['#01b3e5', '#475fd1'],
	stroke: { width: [0,4], curve: 'smooth', colors: ['#475fd1'] },
	dataLabels: {
		enabled: false
	  },
	xaxis: {
		axisBorder: { show: !1 },
		axisTicks: { show: !1 },
		crosshairs: { show: !0 },
		labels: {
			offsetX: 0,
			offsetY: 5,
			style: { fontSize: '13px', fontWeight: 400, colors: '#a8a3b9' }
		}
	},
	yaxis: {
		labels: {
			formatter: function (e) {
				return e;
			},
			style: { fontSize: '13px', fontWeight: 400, colors: '#a8a3b9' },
			offsetX: -15
		},
		tickAmount: 5,
		min: 0,
		max: 50
	},
	grid: {
		borderColor: '#e0e6ed',
		strokeDashArray: 5,
		xaxis: { lines: { show: !1 } },
		yaxis: { lines: { show: !0 } },
		padding: { top: 0, right: 0, bottom: 0, left: 0 }
	},
	legend: {
		show: true,
		position: 'top',
		horizontalAlign: 'right',
		offsetY: -50,
		fontSize: '16px',
		markers: {
			width: 10,
			height: 10,
			// strokeWidth: 0,
			// strokeColor: '#fff',
			// fillColors: void 0,
			radius: 12,
			onClick: void 0,
			offsetX: 0,
			offsetY: 0
		},
		itemMargin: { horizontal: 0, vertical: 0 }
	},
	tooltip: { theme: 'light', marker: { show: !0 }, x: { show: !1 } },
// 	responsive: [
// 		{
// 			breakpoint: 480,
// 			options: {
// 				chart: {
// 					height: 250
// 				}
// 			}
// 		},
// 		{
// 			breakpoint: 5000,
// 			options: {
// 				chart: {
// 					height: 250
// 				}
// 			}
// 		}
// 	]
 };

 export const EnrollmentTargetChartSeries = [
	{
		name: 'Achieved',
		type: 'column',
		data: [12, 18, 2, 8, 4, 9, 14, 12]
	},
	{
		name: 'Goal',
		type: 'line',
		data: [20, 26, 28, 32, 23, 15, 23, 20, 26, 28, 32, 21]
	}
 ]
export const EnrollmentTargetChartOptions = {
	height: '250',
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: '30%',
			borderRadius: 5
		}
	},
	labels: [
		'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
	],
	chart: {
		fontFamily: '$font-family-base',
		height: '250px',
		type: 'line',
		toolbar: { show: !1 }
	},
	colors: ['#01BDF2', '#1B296D'],
	stroke: { width: [0,4], curve: 'smooth', colors: ['#1B296D'] },
	dataLabels: {
		enabled: false
	  },
	xaxis: {
		axisBorder: { show: !1 },
		axisTicks: { show: !1 },
		crosshairs: { show: !0 },
		labels: {
			offsetX: 0,
			offsetY: 5,
			style: { fontSize: '13px', fontWeight: 400, colors: '#a8a3b9' }
		}
	},
	yaxis: {
		labels: {
			formatter: function (e) {
				return e;
			},
			style: { fontSize: '13px', fontWeight: 400, colors: '#a8a3b9' },
			offsetX: -15
		},
		tickAmount: 5,
		min: 0,
		max: 40
	},
	grid: {
		borderColor: '#e0e6ed',
		strokeDashArray: 5,
		xaxis: { lines: { show: !1 } },
		yaxis: { lines: { show: !0 } },
		padding: { top: 0, right: 0, bottom: 0, left: 0 }
	},
	legend: {
		show: true,
		position: 'top',
		horizontalAlign: 'right',
		offsetY: -50,
		fontSize: '16px',
		markers: {
			width: 10,
			height: 10,
			radius: 12,
			onClick: void 0,
			offsetX: 0,
			offsetY: 0
		},
		itemMargin: { horizontal: 0, vertical: 0 }
	},
	tooltip: { theme: 'light', marker: { show: !0 }, x: { show: !1 } },
 };

 export const TimeSpentChartSeries = [55, 88, 80];
 export const TimeSpentChartOptions = {
	 labels: ['Program 1', 'Program X1', 'Program 2'],
	 chart: { type: 'polarArea', height: 200 },
	 colors: ['#475fd1', '#01b3e5', '#845cbd'],
	 legend: { show: true, position: 'bottom', itemMargin: {
		horizontal: 8,
		vertical: 0,
		// padding: {top: 4},
		offsetY: 5,
	},},
	 stroke: { colors: ['#fff'] },
	 fill: { opacity: 0.9 },
	//  responsive: [
	// 	 { breakpoint: 480, options: { chart: { height: 300 } } },
	// 	 { breakpoint: 1441, options: { chart: { height: 270 } } },
	// 	 { breakpoint: 1980, options: { chart: { height: 370 } } },
	// 	 { breakpoint: 2500, options: { chart: { height: 350 } } },
	// 	 { breakpoint: 3000, options: { chart: { height: 500 } } }
	// 	 // { breakpoint: 3500,options: {chart: {height: 580}} },
	// 	 // { breakpoint: 4000,options: {chart: {height: 650}} },
	// 	 // { breakpoint: 5000,options: {chart: {height: 680}} },
	//  ]
 }; 


export const SessionChartSeries = [
	{
		name: 'Session Duration',
		data: [600, 1e3, 400, 2e3, 500, 900, 2500, 1800, 3800],
		colors: ['#754ffe']
	},
	{
		name: 'Page Views',
		data: [1e3, 2e3, 800, 1200, 300, 1900, 1600, 2e3, 1e3]
	},
	{
		name: 'Total Visits',
		data: [2200, 1e3, 3400, 900, 500, 2500, 3e3, 1e3, 2500]
	}
];
export const SessionChartOptions = {
	chart: {
		toolbar: { show: !1 },
		height: 200,
		type: 'line',
		zoom: { enabled: !1 }
	},
	dataLabels: { enabled: !1 },
	stroke: { width: [4, 3, 3], curve: 'smooth', dashArray: [0, 5, 4] },
	legend: { show: !1 },
	colors: ['#754ffe', '#19cb98', '#ffaa46'],
	markers: { size: 0, hover: { sizeOffset: 6 } },
	xaxis: {
		categories: [
			'01 Jan',
			'02 Jan',
			'03 Jan',
			'04 Jan',
			'05 Jan',
			'06 Jan',
			'07 Jan',
			'08 Jan',
			'09 Jan',
			'10 Jan',
			'11 Jan',
			'12 Jan'
		],
		labels: {
			style: {
				colors: ['#5c5776'],
				fontSize: '12px',
				fontFamily: 'Inter',
				cssClass: 'apexcharts-xaxis-label'
			}
		}
	},
	yaxis: {
		labels: {
			style: {
				colors: ['#5c5776'],
				fontSize: '12px',
				fontFamily: 'Inter',
				cssClass: 'apexcharts-xaxis-label'
			},
			offsetX: -12,
			offsetY: 0
		}
	},
	tooltip: {
		y: [
			{
				title: {
					formatter: function (e) {
						return e + ' (mins)';
					}
				}
			},
			{
				title: {
					formatter: function (e) {
						return e + ' per session';
					}
				}
			},
			{
				title: {
					formatter: function (e) {
						return e;
					}
				}
			}
		]
	},
	grid: { borderColor: '#f1f1f1' },
	responsive: [
		{ breakpoint: 480, options: { chart: { height: 300 } } },
		{ breakpoint: 1441, options: { chart: { height: 360 } } },
		{ breakpoint: 1980, options: { chart: { height: 400 } } },
		{ breakpoint: 2500, options: { chart: { height: 470 } } },
		{ breakpoint: 3000, options: { chart: { height: 450 } } }
		//   { breakpoint: 5000,options: {chart: {height: 580}} },
	]
};

export const ProgramWiseChartSeries = [
	{
		name: 'Program 1',
		data: [600, 1e3, 400, 2e3, 500, 900, 2500, 1800, 3800],
		colors: ['#754ffe']
	},
	{
		name: 'Program 2',
		data: [1e3, 2e3, 800, 1200, 300, 1900, 1600, 2e3, 1e3]
	},
	{
		name: 'Program 3',
		data: [2200, 1e3, 3400, 900, 500, 2500, 3e3, 1e3, 2500]
	},
	{
		data: [0,0,0,0,0,0,0,0,0,0,0,0]
	}
];
export const ProgramWiseChartOptions = {
	chart: {
		toolbar: { show: !1 },
		height: 200,
		type: 'line',
		zoom: { enabled: !1 }
	},
	dataLabels: { enabled: !1 },
	stroke: { width: [4, 4, 4], curve: 'smooth',  }, //dashArray: [0, 5, 4]
	legend: { show: true, position: 'top', horizontalAlign: 'right'},
	colors: ['#754ffe', '#19cb98', '#ffaa46'],
	markers: { size: 0, hover: { sizeOffset: 6 } },
	xaxis: {
		categories: [
			'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
		],
		labels: {
			style: {
				colors: ['#5c5776'],
				fontSize: '12px',
				fontFamily: 'Inter',
				cssClass: 'apexcharts-xaxis-label'
			}
		}
	},
	yaxis: {
		labels: {
			style: {
				colors: ['#5c5776'],
				fontSize: '12px',
				fontFamily: 'Inter',
				cssClass: 'apexcharts-xaxis-label'
			},
			offsetX: -12,
			offsetY: 0
		}
	},
	tooltip: {
		y: [
			{
				title: {
					formatter: function (e) {
						return e + 'students';
					}
				}
			},
			{
				title: {
					formatter: function (e) {
						return e + 'students';
					}
				}
			},
			{
				title: {
					formatter: function (e) {
						return e + 'students';
					}
				}
			}
		]
	},
	grid: { borderColor: '#f1f1f1' },
	// responsive: [
	// 	{ breakpoint: 480, options: { chart: { height: 300 } } },
	// 	{ breakpoint: 1441, options: { chart: { height: 360 } } },
	// 	{ breakpoint: 1980, options: { chart: { height: 400 } } },
	// 	{ breakpoint: 2500, options: { chart: { height: 470 } } },
	// 	{ breakpoint: 3000, options: { chart: { height: 450 } } }
	// 	//   { breakpoint: 5000,options: {chart: {height: 580}} },
	// ]
};

/** Active Users Chart Series and options used in Dashboard Analytics page  */

export const StrengthChartSeries = [
	{	
		name: 'Strength',
		data: [
			25, 66, 41, 70, 63, 32, 45
		]
	}
];
export const StrengthChartOptions = {
	chart: { height: 300, type: 'bar', toolbar: { show: false } },
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: '30%',
			borderRadius: 5
		}
	},
	markers: { colors: ['#475fd1'], fillColor: '#475fd1' },
	colors: ['#01b3e5'],
	legend: { show: false },
	stroke: { width: [0, 4], colors: ['#e3dcff'] },
	dataLabels: { enabled: true, enabledOnSeries: [1] },
	labels: ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5', 'Course 6', 'Course 7'],
	xaxis: {
		labels: {
			
			style: {
				fontSize: '13px',
				fontWeight: 400,
				colors: '#a8a3b9',
				fontFamily: 'inter'
			}
		},
		
	},
	yaxis: {
		labels: {
			style: {
				fontSize: '13px',
				fontWeight: 400,
				colors: '#a8a3b9',
				fontFamily: 'inter'
			}
		}
	}
};

export const CoursewiseChartSeries = [
	{
		data: [
			75, 82, 69, 79, 92, 81, 73
		]
	}
];
export const CoursewiseChartOptions = {
	chart: { height: 250, type: 'line', toolbar: { show: false } },
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: '30%',
			borderRadius: 5
		}
	},
	markers: { colors: ['#18113c'], fillColor: '#ecebf1' },
	colors: ['#754ffe', '#754ffe'],
	legend: { show: false },
	stroke: { width: [0, 4], colors: ['#e3dcff'] },
	dataLabels: { enabled: true, enabledOnSeries: [1] },
	labels: ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5', 'Course 6', 'Course 7'],
	xaxis: {
		labels: {
			rotate: -45,
			style: {
				fontSize: '13px',
				fontWeight: 400,
				colors: '#a8a3b9',
				fontFamily: 'inter'
			}
		}
	},
	yaxis: {
		labels: {
			style: {
				fontSize: '13px',
				fontWeight: 400,
				colors: '#a8a3b9',
				fontFamily: 'inter'
			}
		}
	}
};

export const MonthlyAttendanceChartSeries = [
	{	name: 'Attendance',
		data: [
			75, 69, 79, 98, 80, 88, 65, 90, 98, 93, 75, 75 
		]
	},
	// {
	// 	data: [
	// 		75, 69, 79, 98, 80, 88, 65, 90, 98, 93, 75, 75 
	// 	]
	// }
];
export const MonthlyAttendanceChartOptions = {
	chart: { height: 350, type: 'line', toolbar: { show: false } },
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: '25%',
			borderRadius: 5
		}
	},
	markers: { fillColor: '#ecebf1' },
	colors: [ '#754ffe'],
	legend: { show: false },
	stroke: { width: 4, colors: '#e3dcff' },
	dataLabels: { enabled: true, enabledOnSeries: [0] },
	labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	xaxis: {
		labels: {
			
			style: {
				fontSize: '13px',
				fontWeight: 400,
				colors: '#a8a3b9',
				fontFamily: 'inter'
			}
		}
	},
	yaxis: {
		labels: {
			formatter: function (e) {
				return e;
			},
			style: {
				fontSize: '13px',
				fontWeight: 400,
				colors: '#a8a3b9',
				fontFamily: 'inter'
			},
			offsetX: -15
		},
		min: 0,
		max: 100
	},
	responsive: [
		{ breakpoint: 520, options: { chart: { height: 400 } } },
	]
};

export const ActiveUserChartSeries = [
	{
		data: [
			25, 66, 41, 70, 63, 25, 44, 22, 36, 19, 54, 44, 32, 36, 29, 54, 25, 66,
			41, 65, 63, 25, 44, 12, 36, 39, 25, 44, 42, 36, 54
		]
	}
];
export const ActiveUserChartOptions = {
	chart: { type: 'bar', height: 302, sparkline: { enabled: !0 } },
	states: {
		normal: { filter: { type: 'none', value: 0 } },
		hover: { filter: { type: 'darken', value: 0.55 } },
		active: {
			allowMultipleDataPointsSelection: !1,
			filter: { type: 'darken', value: 0.55 }
		}
	},
	colors: ['#8968fe'],
	plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
	xaxis: { crosshairs: { width: 1 } },
	tooltip: {
		fixed: { enabled: !1 },
		x: { show: !1 },
		y: {
			title: {
				formatter: function (e) {
					return 'Active User';
				}
			}
		},
		marker: { show: !1 }
	},
	responsive: [
		{ breakpoint: 520, options: { chart: { height: 300 } } },
		{ breakpoint: 1441, options: { chart: { height: 300 } } },
		{ breakpoint: 1981, options: { chart: { height: 300 } } },
		{ breakpoint: 2500, options: { chart: { height: 400 } } },
		{ breakpoint: 3000, options: { chart: { height: 450 } } }
		// { breakpoint: 5000,options: {chart: {height: 580}} },
	]
};

/** Traffic Channel Chart Series and options used in Dashboard Analytics page  */

export const TrafficChannelChartSeries = [10, 62, 20];
export const TrafficChannelChartOptions = {
	labels: ['Today', 'This Month', 'To Watch'],
	colors: ['#7757A6', '#01BDF2', '#D3D3D3'],
	chart: { type: 'donut' },
	legend: { show: 1, position: 'bottom' },
	dataLabels: { enabled: !1 },
	plotOptions: { pie: { donut: { size: '50%' } } },
	stroke: { width: 2 },
	responsive: [
		{ breakpoint: 480, options: { chart: { height: 240 } } },
		{ breakpoint: 1441, options: { chart: { height: 200 } } },
		{ breakpoint: 1980, options: { chart: { height: 270 } } },
		{ breakpoint: 2000, options: { chart: { height: 270 } } },
		{ breakpoint: 2500, options: { chart: { height: 350 } } },
		{ breakpoint: 3000, options: { chart: { height: 500 } } },
		{ breakpoint: 3500,options: {chart: {height: 580}} },
		{ breakpoint: 4000,options: {chart: {height: 650}} },
		{ breakpoint: 5000,options: {chart: {height: 680}} },
	]
};

/** Operating System Chart Series and options used in Dashboard Analytics page  */

export const OperatingSystemChartSeries = [55, 88, 80];
export const OperatingSystemChartOptions = {
	labels: ['Program 1', 'Lab 1', 'Lab 2'],
	chart: { type: 'polarArea', height: 350 },
	colors: ['#1B296D', '#01BDF2', '#7757A6'],
	legend: { show: !1 },
	stroke: { colors: ['#fff'] },
	fill: { opacity: 0.9 },
	responsive: [
		{ breakpoint: 480, options: { chart: { height: 300 } } },
		{ breakpoint: 1441, options: { chart: { height: 270 } } },
		{ breakpoint: 1980, options: { chart: { height: 370 } } },
		{ breakpoint: 2500, options: { chart: { height: 350 } } },
		{ breakpoint: 3000, options: { chart: { height: 500 } } }
		// { breakpoint: 3500,options: {chart: {height: 580}} },
		// { breakpoint: 4000,options: {chart: {height: 650}} },
		// { breakpoint: 5000,options: {chart: {height: 680}} },
	]
};

export const CourseEnrollmentChartSeries = [55, 88, 80, 46, 57];
export const CourseEnrollmentChartOptions = {
	labels: ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5'],
	chart: { type: 'polarArea', height: 350 },
	colors: ['#1B296D', '#01BDF2', '#7757A6', '#29baa2', '#ba2929' ],
	legend: { show: true, position: 'right' },
	stroke: { colors: ['#fff'] },
	fill: { opacity: 0.9 },
	responsive: [
		{ breakpoint: 480, options: { chart: { height: 300 } } },
		{ breakpoint: 1441, options: { chart: { height: 270 } } },
		{ breakpoint: 1980, options: { chart: { height: 370 } } },
		{ breakpoint: 2500, options: { chart: { height: 350 } } },
		{ breakpoint: 3000, options: { chart: { height: 500 } } }
		// { breakpoint: 3500,options: {chart: {height: 580}} },
		// { breakpoint: 4000,options: {chart: {height: 650}} },
		// { breakpoint: 5000,options: {chart: {height: 680}} },
	]
};

export const CourseCompletionChartSeries = [80, 57,  55, 88, 46];
export const CourseCompletionChartOptions = {
	labels: ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5'],
	chart: { type: 'polarArea', height: 350 },
	colors: ['#1B296D', '#01BDF2', '#7757A6', '#29baa2', '#ba2929' ],
	legend: { show: true, position: 'right' },
	stroke: { colors: ['#fff'] },
	fill: { opacity: 0.9 },
	responsive: [
		{ breakpoint: 480, options: { chart: { height: 300 } } },
		{ breakpoint: 1441, options: { chart: { height: 270 } } },
		{ breakpoint: 1980, options: { chart: { height: 370 } } },
		{ breakpoint: 2500, options: { chart: { height: 350 } } },
		{ breakpoint: 3000, options: { chart: { height: 500 } } }
		// { breakpoint: 3500,options: {chart: {height: 580}} },
		// { breakpoint: 4000,options: {chart: {height: 650}} },
		// { breakpoint: 5000,options: {chart: {height: 680}} },
	]
};

/** User Chart Series and options used in Dashboard Analytics -> StartRightChart component */
export const UserChartSeries = [
	{ name: 'User', data: [28, 40, 36, 52, 38, 60, 55] }
];
export const UserChartOptions = {
	chart: {
		height: 60,
		type: 'area',
		toolbar: { show: !1 },
		sparkline: { enabled: !0 },
		grid: { show: !1, padding: { left: 0, right: 0 } }
	},
	dataLabels: { enabled: !1 },
	stroke: { curve: 'smooth', width: 2 },
	fill: {
		type: 'gradient',
		gradient: {
			shadeIntensity: 0.9,
			opacityFrom: 0.7,
			opacityTo: 0.5,
			stops: [0, 80, 100]
		}
	},
	xaxis: { labels: { show: !1 }, axisBorder: { show: !1 } },
	yaxis: [{ y: 0, offsetX: 0, offsetY: 0, padding: { left: 0, right: 0 } }],
	tooltip: { x: { show: !1 } }
};

export const EnrolledChartSeries = [
	{ name: 'Enrolled', data: [28, 40, 36, 52, 38, 60, 55] }
];
export const EnrolledChartOptions = {
	chart: {
		height: 60,
		type: 'area',
		toolbar: { show: !1 },
		sparkline: { enabled: !0 },
		grid: { show: !1, padding: { left: 0, right: 0 } }
	},
	dataLabels: { enabled: !1 },
	stroke: { curve: 'smooth', width: 2 },
	fill: {
		type: 'gradient',
		gradient: {
			shadeIntensity: 0.9,
			opacityFrom: 0.7,
			opacityTo: 0.5,
			stops: [0, 80, 100]
		}
	},
	xaxis: { labels: { show: !1 }, axisBorder: { show: !1 } },
	yaxis: [{ y: 0, offsetX: 0, offsetY: 0, padding: { left: 0, right: 0 } }],
	tooltip: { x: { show: !1 } }
};
/** Visitor Chart Series and options used in Dashboard Analytics -> StartRightChart component */
export const VisitorChartSeries = [
	{ name: 'User', data: [28, 40, 36, 52, 38, 60, 55] }
];
export const VisitorChartOptions = {
	chart: {
		height: 60,
		type: 'area',
		toolbar: { show: !1 },
		sparkline: { enabled: !0 },
		grid: { show: !1, padding: { left: 0, right: 0 } }
	},
	colors: ['#19cb98'],
	dataLabels: { enabled: !1 },
	stroke: { curve: 'smooth', width: 2 },
	fill: {
		colors: '#19cb98',
		type: 'gradient',
		gradient: {
			type: 'vertical',
			shadeIntensity: 0.9,
			opacityFrom: 0.7,
			opacityTo: 0.5,
			stops: [0, 100]
		}
	},
	xaxis: { labels: { show: !1 }, axisBorder: { show: !1 } },
	yaxis: [{ y: 0, offsetX: 0, offsetY: 0, padding: { left: 0, right: 0 } }],
	tooltip: { x: { show: !1 } }
};

export const ActiveStudentsChartSeries = [
	{ name: 'Students', data: [ 52, 38, 60, 55,  40, 36, 28,] }
];
export const ActiveStudentsChartOptions = {
	chart: {
		height: 60,
		type: 'area',
		toolbar: { show: !1 },
		sparkline: { enabled: !0 },
		grid: { show: !1, padding: { left: 0, right: 0 } }
	},
	colors: ['#19cb98'],
	dataLabels: { enabled: !1 },
	stroke: { curve: 'smooth', width: 2 },
	fill: {
		colors: '#19cb98',
		type: 'gradient',
		gradient: {
			type: 'vertical',
			shadeIntensity: 0.9,
			opacityFrom: 0.7,
			opacityTo: 0.5,
			stops: [0, 100]
		}
	},
	xaxis: { labels: { show: !1 }, axisBorder: { show: !1 } },
	yaxis: [{ y: 0, offsetX: 0, offsetY: 0, padding: { left: 0, right: 0 } }],
	tooltip: { x: { show: !1 } }
};

/** Bounce Chart Series and options used in Dashboard Analytics -> StartRightChart component */
export const BounceChartSeries = [
	{ name: 'Bonus Rate', data: [28, 40, 36, 52, 38, 60, 55] }
];
export const BounceChartOptions = {
	chart: {
		height: 60,
		type: 'line',
		toolbar: { show: !1 },
		sparkline: { enabled: !0 },
		grid: { show: !1, padding: { left: 0, right: 0 } }
	},
	colors: ['#c28135'],
	dataLabels: { enabled: !1 },
	stroke: { curve: 'straight', width: 4 },
	markers: { size: 4, hover: { size: 6, sizeOffset: 3 } },
	xaxis: { labels: { show: !1 }, axisBorder: { show: !1 } },
	yaxis: [{ y: 0, offsetX: 0, offsetY: 0, padding: { left: 0, right: 0 } }],
	tooltip: { x:{ 
        show: true, // Change this to true
        format: 'MMMM' // Use the 'MMMM' format to show the full month name
    } }
};

/** Average Visit Time Chart Series and options used in Dashboard Analytics -> StartRightChart component */
export const AverageVisitTimeChartSeries = [
	{ name: 'User', data: [28, 40, 36, 52, 38, 60, 55] }
];
export const AverageVisitTimeChartOptions = {
	chart: {
		height: 60,
		type: 'area',
		toolbar: { show: !1 },
		sparkline: { enabled: !0 },
		grid: { show: !1, padding: { left: 0, right: 0 } }
	},
	colors: ['#e53f3c'],
	dataLabels: { enabled: !1 },
	stroke: { curve: 'smooth', width: 2 },
	fill: {
		type: 'gradient',
		gradient: {
			shadeIntensity: 0.9,
			opacityFrom: 0.7,
			opacityTo: 0.5,
			stops: [0, 80, 100]
		}
	},
	xaxis: { labels: { show: !1 }, axisBorder: { show: !1 } },
	yaxis: [{ y: 0, offsetX: 0, offsetY: 0, padding: { left: 0, right: 0 } }],
	tooltip: { x: { show: !1 } }
};

/** Order Column Chart Series and options used in Front side Instructor Dashboard page */

export const OrderColumnChartSeries = [{ data: [4, 6, 5, 3, 5, 6, 8, 9] }];
export const OrderColumnChartOptions = {
	chart: { toolbar: { show: !1 }, type: 'bar', height: 272 },
	colors: ['#754FFE'],
	plotOptions: {
		bar: { horizontal: !1, columnWidth: '12%', endingShape: 'rounded' }
	},
	dataLabels: { enabled: !1 },
	stroke: { show: !0, width: 1, colors: ['transparent'] },
	xaxis: {
		categories: [
			'1 Jun',
			'9 Jun',
			'16 jun',
			'18 Jun',
			'19 Jun',
			'22 jun',
			'24 Jun',
			'26 Jun'
		],
		axisBorder: { show: !1 },
		labels: {
			offsetX: 0,
			offsetY: 5,
			style: { fontSize: '13px', fontWeight: 400, colors: '#a8a3b9' }
		}
	},
	grid: {
		borderColor: '#e0e6ed',
		strokeDashArray: 5,
		xaxis: { lines: { show: !1 } },
		yaxis: { lines: { show: !0 } },
		padding: { top: 0, right: 0, bottom: 0, left: -10 }
	},
	yaxis: {
		title: { text: void 0 },
		plotOptions: {
			bar: { horizontal: !1, endingShape: 'rounded', columnWidth: '80%' }
		},
		labels: {
			style: { fontSize: '13px', fontWeight: 400, colors: '#a8a3b9' },
			offsetX: -10
		}
	},
	fill: { opacity: 1 },
	tooltip: {
		y: {
			formatter: function (e) {
				return e + ' sales ';
			}
		},
		marker: { show: !0 }
	}
};

/** Order Column Chart Series and options used in Front side Instructor Dashboard page */
export const PayoutChartSeries = [
	{ name: 'Inflation', data: [40, 20, 50, 80, 65] }
];
export const PayoutChartOptions = {
	chart: { height: 150, type: 'bar', toolbar: { show: !1 } },
	colors: ['#E8E2FF'],
	grid: { show: !1 },
	tooltip: { enabled: !1 },
	plotOptions: { bar: { endingShape: 'flat', columnWidth: '65%' } },
	dataLabels: { enabled: !1 },
	xaxis: {
		labels: { show: !1 },
		categories: [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		],
		position: 'top',
		axisBorder: { show: !1 },
		axisTicks: { show: !1 },
		crosshairs: {
			fill: {
				type: 'gradient',
				gradient: {
					colorFrom: '#D8E3F0',
					colorTo: '#BED1E6',
					stops: [0, 100],
					opacityFrom: 0.4,
					opacityTo: 0.5
				}
			}
		},
		tooltip: { enabled: !0 }
	},
	yaxis: { show: !1 }
};

/** Total Earning Chart  Series and options used in Front side Instructor Dashboard page */
export const TotalEarningChartSeries = [
	{ data: [50, 80, 5, 90, 12, 150, 12, 80, 150] }
];
export const TotalEarningChartOptions = {
	chart: { width: 130, type: 'line', toolbar: { show: !1 } },
	colors: ['#754FFE'],
	stroke: {
		show: !0,
		curve: 'smooth',
		lineCap: 'butt',
		colors: ['#19cb98'],
		width: 2,
		dashArray: 0
	},
	xaxis: {
		axisBorder: { show: !1 },
		labels: { show: !1 },
		categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
	},
	yaxis: { labels: { show: !1 } },
	grid: { show: !1 },
	tooltip: { enabled: !1 }
};

/** Budget Expense Chart series and options used in dashboard program budget page  *
 *  added in v1.2.0
 */

export const AssignmentStatsChartSeries = [
	{
		name: 'Done',
		type: 'column',
		data: [12, 18, 0]
	},
	{
		name: 'Total',
		type: 'line',
		data: [20, 26, 28]
	}
];
export const AssignmentStatsChartOptions = {
	chart: { height: 350, type: 'line', toolbar: { show: false } },
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: '40%',
			borderRadius: 5
		}
	},
	markers: { colors: ['#18113c'], fillColor: '#ecebf1' },
	colors: ['#e3dcff', '#754ffe'],
	legend: { show: false },
	stroke: { width: [0, 4], colors: ['#e3dcff'] },
	dataLabels: { enabled: true, enabledOnSeries: [1] },
	labels: ['Last Week', 'This Week', 'Next Week'],
	xaxis: {
		labels: {
			rotate: -45,
			style: {
				fontSize: '13px',
				fontWeight: 400,
				colors: '#a8a3b9',
				fontFamily: 'inter'
			}
		}
	},
	yaxis: {
		labels: {
			style: {
				fontSize: '13px',
				fontWeight: 400,
				colors: '#a8a3b9',
				fontFamily: 'inter'
			}
		}
	}
};

/** overall progress chart  Series and options used in Front side Instructor Dashboard page
 *   added in v1.2.0 for /dashboard/programs/single/overview page
 */
export const OverallProgressChartSeries = [75];
export const OverallProgressChartOptions = {
	chart: { height: 350, type: 'radialBar', toolbar: { show: false } },
	colors: ['#01b3e5'],
	plotOptions: {
		radialBar: {
			startAngle: -135,
			endAngle: 225,
			hollow: {
				margin: 0,
				size: '70%',
				background: '#fff',
				image: undefined,
				imageOffsetX: 0,
				imageOffsetY: 0,
				position: 'front',
				dropShadow: {
					enabled: true,
					blur: 4,
					opacity: 0.1
				}
			},
			track: {
				// background: '#fff',
				strokeWidth: '100%',
				margin: 0, // margin is in pixels
			},

			dataLabels: {
				showOn: 'always',
				name: {
					show: false
				},
				value: {
					formatter: function (val) {
						return parseInt(val) + '%';
					},
					color: '#18113c',
					fontSize: '48px',
					fontWeight: '700',
					show: true
				}
			}
		}
	},
	fill: {
		type: 'gradient',
		gradient: {
			shade: 'dark',
			type: 'horizontal',
			shadeIntensity: 0.5,
			gradientToColors: ['#018bb2'],
			inverseColors: false,
			opacityFrom: 1,
			opacityTo: 1,
			stops: [0, 100]
		}
	},
	stroke: {
		lineCap: 'round'
	}
};

 export const OverallAttendanceChartSeries = [75];
export const OverallAttendanceChartOptions = {
	chart: { height: 350, type: 'radialBar', toolbar: { show: false } },
	colors: ['#754ffe', '#ffaa46'],
	plotOptions: {
		radialBar: {
			startAngle: -135,
			endAngle: 225,
			hollow: {
				margin: 0,
				size: '70%',
				background: '#fff',
				image: undefined,
				imageOffsetX: 0,
				imageOffsetY: 0,
				position: 'front',
				dropShadow: {
					enabled: true,
					top: 3,
					left: 0,
					blur: 4,
					opacity: 0.24
				}
			},
			track: {
				background: '#fff',
				strokeWidth: '67%',
				margin: 0, // margin is in pixels
				dropShadow: {
					enabled: true,
					top: -3,
					left: 0,
					blur: 4,
					opacity: 0.35
				}
			},

			dataLabels: {
				showOn: 'always',
				name: {
					show: false
				},
				value: {
					formatter: function (val) {
						return parseInt(val) + '%';
					},
					color: '#18113c',
					fontSize: '48px',
					fontWeight: '700',
					show: true
				}
			}
		}
	},
	fill: {
		type: 'gradient',
		gradient: {
			shade: 'dark',
			type: 'horizontal',
			shadeIntensity: 0.5,
			gradientToColors: ['#ffaa46'],
			inverseColors: false,
			opacityFrom: 1,
			opacityTo: 1,
			stops: [0, 100]
		}
	},
	stroke: {
		lineCap: 'round'
	},
};
/** task summary chart series and options used in dashboard page
 *   added in v1.2.0 for /dashboard/programs/single/task page
 */
export const TaskSummaryChartSeries = [
	{
		name: 'Closed',
		type: 'column',
		data: [12, 18, 20, 32, 19, 25, 30]
	},
	{
		name: 'New',
		type: 'line',
		data: [20, 32, 28, 50, 38, 35, 49]
	}
];
export const TaskSummaryChartOptions = {
	chart: { height: 350, type: 'line', toolbar: { show: false } },
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: '40%',
			borderRadius: 5
		}
	},
	markers: { colors: ['#18113c'], fillColor: '#ecebf1' },
	colors: ['#e3dcff', '#754ffe'],
	legend: { show: false },
	stroke: { width: [0, 4], colors: ['#e3dcff'] },
	dataLabels: { enabled: true, enabledOnSeries: [1] },
	labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
	xaxis: {
		labels: {
			style: {
				fontSize: '13px',
				fontWeight: 400,
				colors: '#a8a3b9',
				fontFamily: 'inter'
			}
		}
	},
	yaxis: {
		labels: {
			style: {
				fontSize: '13px',
				fontWeight: 400,
				colors: '#a8a3b9',
				fontFamily: 'inter'
			}
		}
	}
};

export const EngagementChartSeries = [
	{
		name: 'Hours',
		type: 'column',
		data: [12, 18, 20, 32, 19]
	},
	// {
	// 	name: 'New',
	// 	type: 'line',
	// 	data: [20, 32, 28, 50, 38, 35, 49]
	// }
];

export const EngagementChartOptions = {
	chart: { height: 350, type: 'line', toolbar: { show: false } },
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: '40%',
			borderRadius: 5
		}
	},
	markers: { colors: ['#18113c'], fillColor: '#ecebf1' },
	colors: ['#e3dcff', '#754ffe'],
	legend: { show: false },
	stroke: { width: [0, 4], colors: ['#e3dcff'] },
	dataLabels: { enabled: true, enabledOnSeries: [1] },
	labels: ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5'],
	xaxis: {
		labels: {
			style: {
				fontSize: '13px',
				fontWeight: 400,
				colors: '#a8a3b9',
				fontFamily: 'inter'
			}
		}
	},
	yaxis: {
		labels: {
			style: {
				fontSize: '13px',
				fontWeight: 400,
				colors: '#a8a3b9',
				fontFamily: 'inter'
			}
		}
	}
};

/** task completion status chart series and options used in dashboard page
 *   added in v1.2.0 for /dashboard/programs/single/task page
 */
export const TaskStatusChartSeries = [75, 25];
export const TaskStatusChartOptions = {
	dataLabels: {
		enabled: false
	},
	labels: ['Completed', 'Incomplete'],
	colors: ['#754ffe', '#29baf9'],
	chart: {
		width: 480,
		type: 'donut'
	},
	plotOptions: {
		pie: {
			expandOnClick: false,
			donut: {
				size: '75%'
			}
		}
	},
	legend: {
		position: 'bottom',
		fontFamily: 'inter',
		fontWeight: 500,
		fontSize: '14px',
		markers: {
			width: 8,
			height: 8,
			strokeWidth: 0,
			strokeColor: '#fff',
			fillColors: undefined,
			radius: 12,
			customHTML: undefined,
			onClick: undefined,
			offsetX: -2,
			offsetY: 1
		},
		itemMargin: {
			horizontal: 8,
			vertical: 0
		}
	},
	tooltip: {
		theme: 'light',
		marker: {
			show: true
		},
		x: {
			show: false
		}
	},
	states: {
		hover: {
			filter: {
				type: 'none'
			}
		}
	},
	responsive: [
		{
			breakpoint: 480,
			options: {
				chart: {
					height: 300
				}
			}
		},
		{
			breakpoint: 5000,
			options: {
				chart: {
					height: 380
				}
			}
		}
	]
};

export const OverallProgressInstructorChartSeries = [30, 25,45];
export const OverallProgressInstructorChartOptions = {
	dataLabels: {
		enabled: false
	},
	labels: ['Published', 'In Progress', 'Completed'],
	colors: ['#1B296D', '#01BDF2', '#7757A6'],
	chart: {
		width: 480,
		type: 'donut'
	},
	plotOptions: {
		pie: {
			expandOnClick: false,
			donut: {
				size: '75%'
			}
		}
	},
	legend: {
		position: 'bottom',
		fontFamily: 'inter',
		fontWeight: 500,
		fontSize: '14px',
		markers: {
			width: 8,
			height: 8,
			strokeWidth: 0,
			strokeColor: '#fff',
			fillColors: undefined,
			radius: 12,
			customHTML: undefined,
			onClick: undefined,
			offsetX: -2,
			offsetY: 1
		},
		itemMargin: {
			horizontal: 8,
			vertical: 0
		}
	},
	tooltip: {
		theme: 'light',
		marker: {
			show: true
		},
		x: {
			show: false
		}
	},
	states: {
		hover: {
			filter: {
				type: 'none'
			}
		}
	},
};

/** task by sections chart series and options used in dashboard page
 *   added in v1.2.0 for /dashboard/programs/single/task page
 */
export const TaskSectionChartSeries = [44, 65, 89, 75];
export const TaskSectionChartOptions = {
	chart: {
		height: 200,
		toolbar: {
			show: false
		},
	},
	legend: {
		show: true,
		fontSize: '14px',
		fontFamily: 'Inter',
		fontWeight: 500,
		position: 'bottom',
		itemMargin: {
			horizontal: 8,
			vertical: 0
		},
		labels: {
			colors: '#373d3f',
			useSeriesColors: false
		},
		markers: {
			width: 8,
			height: 8,
			offsetY: 1,
			offsetX: -2
		}
	},
	plotOptions: {
		radialBar: {
			dataLabels: {
				name: {},
				value: {
					fontSize: '24px',
					fontWeight: 600,
					formatter: function (val) {
						return val;
					}
				},
			},
			track: {
				background: '#f5f4f8',
				margin: 10
			}
		},
		bar: {
			horizontal: true,
		}
	},
	colors: ['#19cb98', '#754ffe', '#29baf9', '#ffaa46'],
	labels: ['Course 1', 'Course 2', 'Course 3', 'Course 4'],
};

export const ChartData = [
	TrafficChartSeries,
	TrafficChartOptions,
	EarningsChartSeries,
	EarningsChartOptions,

	SessionChartSeries,
	SessionChartOptions,
	ActiveUserChartSeries,
	ActiveUserChartOptions,
	TrafficChannelChartSeries,
	TrafficChannelChartOptions,
	OperatingSystemChartSeries,
	OperatingSystemChartOptions,

	UserChartSeries,
	UserChartOptions,
	VisitorChartSeries,
	VisitorChartOptions,
	BounceChartSeries,
	BounceChartOptions,
	AverageVisitTimeChartSeries,
	AverageVisitTimeChartOptions,

	OrderColumnChartSeries,
	OrderColumnChartOptions,

	PayoutChartSeries,
	PayoutChartOptions,

	TotalEarningChartSeries,
	TotalEarningChartOptions,

	AssignmentStatsChartSeries,
	AssignmentStatsChartOptions,

	OverallProgressChartSeries,
	OverallProgressChartOptions,

	TaskSummaryChartSeries,
	TaskSummaryChartOptions,

	TaskStatusChartSeries,
	TaskStatusChartOptions,

	TaskSectionChartSeries,
	TaskSectionChartOptions,

	EngagementChartOptions,
	EngagementChartSeries,

	TotalProgramsChartSeries,
	TotalProgramsChartOptions,

	StrengthChartSeries,
	StrengthChartOptions,

	WeeklyGoalChartSeries,
	WeeklyGoalChartOptions,

	TimeSpentChartSeries,
	TimeSpentChartOptions,

	MonthlyAttendanceChartSeries,
	MonthlyAttendanceChartOptions,

	OverallAttendanceChartSeries,
	OverallAttendanceChartOptions,

	CoursewiseChartSeries,
	CoursewiseChartOptions,

	OverallProgressInstructorChartSeries,
	OverallProgressInstructorChartOptions,

	ProgramAnalysisChartSeries,
	ProgramAnalysisChartOptions,

	CourseEnrollmentChartSeries,
	CourseEnrollmentChartOptions,

	CourseCompletionChartSeries,
	CourseCompletionChartOptions,

	EnrolledChartOptions,
	EnrolledChartSeries,

	ActiveStudentsChartSeries,
	ActiveStudentsChartOptions,

	OverallProgramsChartSeries,
	OverallProgramsChartOptions,

	EnrollmentTargetChartSeries,
	EnrollmentTargetChartOptions,
	
	ProgramWiseChartSeries,
	ProgramWiseChartOptions,

];

export default ChartData;
