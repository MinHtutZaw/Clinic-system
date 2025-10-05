import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from 'recharts';

const chartConfig1 = {
    total_amount: { label: 'Total Amount', color: 'var(--chart-1)' },
    total_duration: { label: 'Total Duration', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const chartConfig = {
    expense: {
        label: 'Expense',
        color: 'var(--chart-1)',
    },
    income: {
        label: 'Income',
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
    const [chartData, setChartData] = useState([]);
    const [chartData1, setChartData1] = useState([]);
    const [profit, setProfit] = useState(0);
    const [product, setProduct] = useState<any>();
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

    useEffect(() => {
        axios
            .post(route('getdashboarddata'))
            .then((res) => {
                setChartData(res.data.daily);
                function getRandomPastelLavender() {
                    // Base hues for lavender plus complementary pastel tones
                    const baseHues = [240, 250, 260, 270, 280, 290]; // purples, lilacs
                    const hue = baseHues[Math.floor(Math.random() * baseHues.length)] + Math.random() * 10; // slight variation
                    const saturation = 40 + Math.random() * 40; // 40-80%
                    const lightness = 60 + Math.random() * 25; // 60-85%, softer pastels
                    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                }

                const chartData1 = res.data.products.map((p) => ({
                    product: p.product,
                    total_amount: Number(p.total_amount),
                    total_duration: Number(p.total_duration),
                    fill: getRandomPastelLavender(),
                }));
                setProfit(res.data.profit);
                setProduct(res.data.mostUsedProduct);
                setChartData1(chartData1);
            })
            .catch((err) => console.error(err));
    }, []);
    console.log(chartData1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mt-4 grid grid-cols-2 gap-4 px-2">
                <Card className="flex w-full flex-col">
                    <CardHeader>
                        <CardTitle>Profit Overview</CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col gap-2 overflow-y-auto">
                        <span className={profit < 0 ? 'font-semibold text-red-500' : 'font-semibold text-green-400'}>
                            {profit.toLocaleString()} MMK
                        </span>
                    </CardContent>
                </Card>

                <Card className="flex w-full flex-col">
                    <CardHeader>
                        <CardTitle>Most Used Products</CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col gap-2 overflow-y-auto">{product?.name}</CardContent>
                </Card>
            </div>
            <Card className="mx-2 mt-4 pt-0">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                    <div className="grid flex-1 gap-1">
                        <CardTitle>Profit Chart - Income/Expense</CardTitle>
                        <CardDescription>Showing total Icome and Expense in last 3 months</CardDescription>
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
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-expense)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-expense)" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.1} />
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
                            <Area dataKey="expense" type="natural" fill="url(#fillExpense)" stroke="var(--color-expense)" stackId="a" />
                            <Area dataKey="income" type="natural" fill="url(#fillIncome)" stroke="var(--color-income)" stackId="a" />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <div className="mx-2 my-4 grid grid-cols-2 gap-6">
                <Card className="flex flex-col">
                    <CardHeader className="items-center pb-0">
                        <CardTitle>Product Sales Overview</CardTitle>
                        <CardDescription>Total Amount by Product</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 pb-0">
                        <ChartContainer config={chartConfig1} className="mx-auto aspect-square max-h-[250px] px-0">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="product" hideLabel />} />
                                <Pie
                                    data={chartData1}
                                    dataKey="total_amount"
                                    nameKey="product"
                                    labelLine={false}
                                    label={({ payload, ...props }) => (
                                        <text
                                            cx={props.cx}
                                            cy={props.cy}
                                            x={props.x}
                                            y={props.y}
                                            textAnchor={props.textAnchor}
                                            dominantBaseline={props.dominantBaseline}
                                            fill="hsla(var(--foreground))"
                                            fontSize={12}
                                        >
                                            {payload.product}
                                        </text>
                                    )}
                                >
                                    {chartData1.map((entry, index) => (
                                        <Cell key={index} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="flex w-full flex-col">
                    <CardHeader>
                        <CardTitle>Products Overview</CardTitle>
                        <CardDescription>List of products and their assigned colors</CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-1 flex-col gap-2 overflow-y-auto">
                        {chartData1.map((product, index) => (
                            <div key={index} className="flex items-center justify-between rounded-md bg-muted/10 p-2">
                                <div className="flex items-center gap-2">
                                    {/* Color swatch */}
                                    <span className="h-4 w-4 rounded-sm" style={{ backgroundColor: product.fill }}></span>
                                    <span className="font-medium">{product.product}</span>
                                </div>

                                <div className="flex gap-4">
                                    <span className="text-sm font-semibold">{product.total_amount.toLocaleString()} MMK</span>
                                    <span className="text-sm text-muted-foreground">{product.total_duration} min</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
