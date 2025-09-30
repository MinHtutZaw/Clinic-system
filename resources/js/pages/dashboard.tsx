import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { TrendingUp } from 'lucide-react';
import React from 'react';
import { Area, AreaChart, CartesianGrid, Pie, PieChart, XAxis } from 'recharts';
const chartData = [
    { date: '2024-06-23', desktop: 480, mobile: 530 },
    { date: '2024-06-24', desktop: 132, mobile: 180 },
    { date: '2024-06-25', desktop: 141, mobile: 190 },
    { date: '2024-06-26', desktop: 434, mobile: 380 },
    { date: '2024-06-27', desktop: 448, mobile: 490 },
    { date: '2024-06-28', desktop: 149, mobile: 200 },
    { date: '2024-06-29', desktop: 103, mobile: 160 },
    { date: '2024-06-30', desktop: 446, mobile: 400 },
];
const chartData1 = [
    { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
    { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
    { browser: 'firefox', visitors: 187, fill: 'var(--color-firefox)' },
    { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
    { browser: 'other', visitors: 90, fill: 'var(--color-other)' },
];
const chartConfig1 = {
    visitors: {
        label: 'Visitors',
    },
    chrome: {
        label: 'Chrome',
        color: 'var(--chart-1)',
    },
    safari: {
        label: 'Safari',
        color: 'var(--chart-2)',
    },
    firefox: {
        label: 'Firefox',
        color: 'var(--chart-3)',
    },
    edge: {
        label: 'Edge',
        color: 'var(--chart-4)',
    },
    other: {
        label: 'Other',
        color: 'var(--chart-5)',
    },
} satisfies ChartConfig;
const chartConfig = {
    visitors: {
        label: 'Visitors',
    },
    desktop: {
        label: 'Desktop',
        color: 'var(--chart-1)',
    },
    mobile: {
        label: 'Mobile',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const [timeRange, setTimeRange] = React.useState('90d');
    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        const referenceDate = new Date('2024-06-30');
        let daysToSubtract = 90;
        if (timeRange === '30d') {
            daysToSubtract = 30;
        } else if (timeRange === '7d') {
            daysToSubtract = 7;
        }
        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
    });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Card className="pt-0 mx-2 mt-4">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                    <div className="grid flex-1 gap-1">
                        <CardTitle>Area Chart - Interactive</CardTitle>
                        <CardDescription>Showing total visitors for the last 3 months</CardDescription>
                    </div>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select a value">
                            <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                Last 3 months
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                        <AreaChart data={filteredData}>
                            <defs>
                                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    });
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            });
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area dataKey="mobile" type="natural" fill="url(#fillMobile)" stroke="var(--color-mobile)" stackId="a" />
                            <Area dataKey="desktop" type="natural" fill="url(#fillDesktop)" stroke="var(--color-desktop)" stackId="a" />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <div className="grid grid-cols-2 mx-2 my-4">
                <Card className="flex flex-col">
                    <CardHeader className="items-center pb-0">
                        <CardTitle>Pie Chart - Custom Label</CardTitle>
                        <CardDescription>January - June 2024</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                        <ChartContainer config={chartConfig1} className="mx-auto aspect-square max-h-[250px] px-0">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="visitors" hideLabel />} />
                                <Pie
                                    data={chartData1}
                                    dataKey="visitors"
                                    labelLine={false}
                                    label={({ payload, ...props }) => {
                                        return (
                                            <text
                                                cx={props.cx}
                                                cy={props.cy}
                                                x={props.x}
                                                y={props.y}
                                                textAnchor={props.textAnchor}
                                                dominantBaseline={props.dominantBaseline}
                                                fill="hsla(var(--foreground))"
                                            >
                                                {payload.visitors}
                                            </text>
                                        );
                                    }}
                                    nameKey="browser"
                                />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
