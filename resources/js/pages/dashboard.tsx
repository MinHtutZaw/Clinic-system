import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, XAxis, Legend } from 'recharts';
import { route } from 'ziggy-js';

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
    type ChartDataItem = { date: string; expense: number; income: number };

    const [chartData, setChartData] = useState<ChartDataItem[]>([]);

    type ChartData1Item = { product: string; total_amount: number; total_duration: number; fill: string };
    const [chartData1, setChartData1] = useState<ChartData1Item[]>([]);
    const [profit, setProfit] = useState(0);
    const [product, setProduct] = useState<any>();

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        const referenceDate = new Date(); // current date
        let daysToSubtract = 90;
        if (timeRange === '30d') daysToSubtract = 30;
        else if (timeRange === '7d') daysToSubtract = 7;

        const startDate = new Date(referenceDate);
        startDate.setDate(referenceDate.getDate() - daysToSubtract);
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

                const chartData1 = res.data.products.map((p: { product: any; total_amount: any; total_duration: any; }) => ({
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
            {/* Top cards */}
            <div className="mt-4 grid grid-cols-1 gap-4 px-2 md:grid-cols-2">
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
                    <CardContent className="flex flex-1 flex-col gap-2 overflow-y-auto">
                        {product?.name}
                    </CardContent>
                </Card>
            </div>
            <Card className="mx-2 mt-4 pt-0">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                    <div className="grid flex-1 gap-1">
                        <CardTitle>Profit Chart - Income/Expense</CardTitle>
                        <CardDescription>
                            Showing total Income and Expense in the last{' '}
                            {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '3 months'}
                        </CardDescription>

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


            {/* Bottom charts */}
            <div className="mx-2 my-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader className="items-center pb-0">
                        <CardTitle>Product Sales Overview</CardTitle>
                        <CardDescription>Total Amount by Product</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 ">
                        <ChartContainer config={chartConfig1} className="mx-auto aspect-square max-h-[250px] px-0">

                            <PieChart
                               
                            >
                                <ChartTooltip content={<ChartTooltipContent nameKey="product" hideLabel />} />

                                {/* ✅ Legend  */}
                             
                                <Legend
                                    layout="horizontal"
                                    align="center"       // horizontal alignment
                                    verticalAlign="bottom" // position at the bottom
                                    iconSize={10}
                                    wrapperStyle={{ paddingTop: 30 }}
                                />

                                <Pie
                                    data={chartData1}
                                    dataKey="total_amount"
                                    nameKey="product"
                                    outerRadius="100%" // You can adjust this back to desired size
                                    labelLine={false} // ✅ Remove label lines
                                    label={false}     // ✅ Completely disable slice labels
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
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-md bg-muted/10 p-2 gap-2 sm:gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="h-4 w-4 rounded-sm flex-shrink-0" style={{ backgroundColor: product.fill }}></span>
                                    <span className="font-medium text-sm sm:text-base break-words">{product.product}</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <span className="text-sm font-semibold whitespace-nowrap">{product.total_amount.toLocaleString()} MMK</span>
                                    {(() => {
                                        const hours = Math.floor(product.total_duration / 60);
                                        const minutes = product.total_duration % 60;
                                        return (
                                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                                {hours > 0
                                                    ? `${hours} hr${hours > 1 ? 's' : ''}${minutes ? ` ${minutes} min` : ''}`
                                                    : `${minutes} min`}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
