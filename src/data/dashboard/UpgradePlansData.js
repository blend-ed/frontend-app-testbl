import { v4 as uuid } from 'uuid';

export const UpgradePlansData = [
    {
        id: uuid(),
        icon: 'building',
        plantitle: 'Startup',
        description: `<span class="fw-light">For 
			<span class="text-dark fw-medium">Schools</span> & <span class="text-dark fw-medium">Edtech Companies</span>`,
        monthly: {
            IN: 7300,
            US: 88
        },
        borderColor: 'dark',
        buttonText: 'Join the Waitlist',
        buttonURL: 'https://www.blend-ed.com/startup',
        buttonClass: 'outline-primary',
        featureHeading: 'Everything in Free, plus:',
        featureDescription: `For enterprises needing white-labelled web app.`,
        features: [
            '200 Monthly Active Users',
            'Payment Gateway Integration',
            'Zoom Integration',
            'LTI Integration'
        ]
    },
    {
        id: uuid(),
        icon: 'hotel',
        plantitle: 'Growth',
        description: `For <span class="text-dark fw-medium">Bootcamps</span> & <span class="text-dark fw-medium">Large Enterprises</span>`,
        monthly: {
            IN: 73000,
            US: 880
        },
        borderColor: 'dark',
        buttonText: 'Request a Demo',
        buttonURL: 'https://www.blend-ed.com/growth',
        buttonClass: 'primary',
        featureHeading: 'Everything in Startup, plus:',
        featureDescription: `Ideal for big enterprises, providing advanced 
		features.`,
        features: [
            '400 Monthly Active Users',
            'B2B2B Sale Option',
            'H5P Content Authoring',
            'Component level AI Mentoring',
        ]
    },
    {
        id: uuid(),
        icon: 'city',
        plantitle: 'Enterprise',
        description: `For <span class="text-dark fw-medium">Larger Enterprises</span> who opt for <span class="text-dark fw-medium">Customization</span>`,
        borderColor: 'secondary',
        buttonText: 'Contact Sales',
        buttonURL: 'https://www.blend-ed.com/enterprise',
        buttonClass: 'outline-primary',
        featureDescription: `For large enterprises requiring custom solutions and pricing.`,
        featureHeading: 'Everything in Growth, plus:',
        features: [
            'Custom Monthly Active Users',
            'Custom Storage',
            'Custom Bandwidth',
            'Custom Authentication',
        ]
    },
];

export default UpgradePlansData;
