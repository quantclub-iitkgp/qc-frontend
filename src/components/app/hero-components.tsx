import { Marquee } from "@devnomic/marquee"
import { ChevronsUpDown, Terminal, TrendingUp } from "lucide-react"

import * as React from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"

import { cn } from "@/lib/utils"

export default function HeroComponents({
  className,
  reverse,
}: {
  className?: string
  reverse?: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-full w-[340px] absolute top-[70px] pointer-events-none overflow-y-hidden",
        className,
      )}
    >
      <Marquee
        direction="up"
        reverse={reverse}
        className="flex flex-col w-full max-w-full h-full overflow-hidden pr-3 [&>*]:gap-[20px]"
      >
        <CardExample />
        <AlertExample />
        <AccordionExample />
        <InputOTPExample />
        <ResizableExample />
        <ScrollAreaExample />
        <SliderExample />
        <BreadcrumbExample />
        <RadioGroupExample />
        <CheckboxExample />
        <CarouselExample />
        <CollapsibleExample />
      </Marquee>
    </div>
  )
}

const CardExample = () => (
  <Card className="w-full bg-main text-main-foreground max-w-sm">
    <CardHeader>
      <CardTitle>Trading Account Login</CardTitle>
      <CardDescription>
        Enter your credentials to access your quantitative portfolio
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Trader ID</Label>
            <Input
              id="email"
              type="email"
              placeholder="trader@quant.com"
              required
              tabIndex={-1}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Access Key</Label>
              <a
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                tabIndex={-1}
              >
                Reset key?
              </a>
            </div>
            <Input id="password" type="password" required tabIndex={-1} />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter className="flex-col gap-2">
      <Button variant="neutral" type="submit" className="w-full" tabIndex={-1}>
        Login to Dashboard
      </Button>
      <Button className="w-full" tabIndex={-1}>
        Connect Trading API
      </Button>
      <div className="mt-4 text-center text-sm">
        New to algorithmic trading?{" "}
        <a href="#" className="underline underline-offset-4" tabIndex={-1}>
          Sign up for a demo account
        </a>
      </div>
    </CardFooter>
  </Card>
)

const AlertExample = () => (
  <Alert>
    <TrendingUp />
    <AlertTitle>Market Alert</AlertTitle>
    <AlertDescription>
      S&P 500 volatility exceeding 3-month average. Algorithmic risk models adjusting parameters.
    </AlertDescription>
  </Alert>
)

const AccordionExample = () => (
  <Accordion className="w-full" type="single" collapsible>
    <AccordionItem className="max-w-full" value="item-1">
      <AccordionTrigger tabIndex={-1}>What is quantitative trading?</AccordionTrigger>
      <AccordionContent>
        Quantitative trading uses mathematical models and algorithms to identify trading opportunities and execute trades.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const InputOTPExample = () => (
  <div className="bg-main w-full flex-col border-2 border-border shadow-shadow py-4 flex items-center justify-center rounded-base">
    <p className="mb-4 text-lg text-main-foreground font-heading">
      Trade Authorization Code:
    </p>

    <InputOTP inert maxLength={6}>
      <InputOTPGroup>
        {[0, 1, 2].map((index) => (
          <InputOTPSlot key={index} index={index} tabIndex={-1} />
        ))}
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        {[3, 4, 5].map((index) => (
          <InputOTPSlot key={index} index={index} tabIndex={-1} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  </div>
)

const ResizableExample = () => (
  <ResizablePanelGroup
    direction="horizontal"
    inert
    className="rounded-base max-w-md max-h-[200px] min-h-[200px] border-2 border-border text-main-foreground shadow-shadow"
  >
    <ResizablePanel tabIndex={-1} defaultSize={50}>
      <div className="flex h-full items-center justify-center bg-main p-6">
        <span className="font-base">Market Data</span>
      </div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel tabIndex={-1} defaultSize={50}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel tabIndex={-1} defaultSize={25}>
          <div className="flex h-full items-center justify-center bg-main p-6">
            <span className="font-base">Technical Analysis</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel tabIndex={-1} defaultSize={75}>
          <div className="flex h-full items-center justify-center bg-main p-6">
            <span className="font-base">Portfolio Allocation</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  </ResizablePanelGroup>
)

const ScrollAreaExample = () => (
  <ScrollArea
    tabIndex={-1}
    inert
    className="rounded-base h-[150px] w-full text-main-foreground border-2 border-border bg-main p-4 shadow-shadow"
  >
    Recent analysis shows that machine learning models have outperformed traditional 
    time-series forecasting in predicting market volatility during the last quarter. 
    Our neural network implementation has achieved a 27% reduction in mean absolute 
    error when forecasting intraday price movements for high-volume tech stocks. 
    The model's performance is particularly strong during earnings seasons, with 
    accuracy improvements of up to 34% compared to ARIMA models.
  </ScrollArea>
)

const SliderExample = () => (
  <div className="bg-main w-full border-2 border-border shadow-shadow p-4 py-6 flex items-center justify-center rounded-base">
    <div className="w-full">
      <p className="text-sm text-center mb-2 text-main-foreground">Risk Tolerance Adjustment</p>
      <Slider defaultValue={[33]} max={100} step={1} tabIndex={-1} inert />
    </div>
  </div>
)

const BreadcrumbExample = () => (
  <div className="bg-main w-full border-2 border-border shadow-shadow p-4 flex items-center justify-center rounded-base">
    <Breadcrumb>
      <BreadcrumbList className="gap-1 sm:gap-1 text-main-foreground">
        <BreadcrumbItem>
          <BreadcrumbLink tabIndex={-1} href="/">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink tabIndex={-1} href="/shadcn/components/button">
            Portfolio Analytics
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage tabIndex={-1}>Performance Metrics</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
)

const RadioGroupExample = () => (
  <div className="bg-main w-full border-2 border-border shadow-shadow p-4 flex items-center justify-center rounded-base">
    <RadioGroup defaultValue="momentum" inert>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          tabIndex={-1}
          className="dark:text-main-foreground"
          value="value"
          id="r1"
        />
        <Label className="text-main-foreground" htmlFor="r1">
          Value Strategy
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          tabIndex={-1}
          className="dark:text-main-foreground"
          value="momentum"
          id="r2"
        />
        <Label className="text-main-foreground" htmlFor="r2">
          Momentum Strategy
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          tabIndex={-1}
          className="dark:text-main-foreground"
          value="mean-reversion"
          id="r3"
        />
        <Label className="text-main-foreground" htmlFor="r3">
          Mean Reversion
        </Label>
      </div>
    </RadioGroup>
  </div>
)

const CheckboxExample = () => (
  <div className="bg-main w-full border-2 border-border shadow-shadow p-4 flex text-main-foreground items-center justify-center rounded-base">
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" tabIndex={-1} />
      <Label htmlFor="terms">Enable automated trading execution</Label>
    </div>
  </div>
)

const CarouselExample = () => (
  <div className="w-full flex-col items-center gap-4 flex">
    <Carousel className="w-full max-w-[200px]">
      <CarouselContent>
        {["SPY", "QQQ", "AAPL", "MSFT", "NVDA"].map((ticker, index) => (
          <CarouselItem key={index}>
            <div className="p-[10px]">
              <Card className="shadow-none p-0 bg-main text-main-foreground">
                <CardContent className="flex aspect-square items-center justify-center p-4">
                  <span className="text-lg font-base">{ticker}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious tabIndex={-1} />
      <CarouselNext tabIndex={-1} />
    </Carousel>
  </div>
)

const CollapsibleExample = () => (
  <Collapsible className="w-full space-y-2">
    <div className="rounded-base flex items-center justify-between space-x-4 border-2 border-border text-main-foreground bg-main px-4 py-2">
      <h4 className="text-sm font-heading">Market Watchlist</h4>
      <CollapsibleTrigger asChild>
        <Button
          variant="noShadow"
          size="sm"
          className="w-9 bg-secondary-background text-foreground p-0"
          tabIndex={-1}
        >
          <ChevronsUpDown className="size-4" />
          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
    </div>
    <div className="rounded-base border-2 border-border bg-main px-4 py-3 font-mono font-base text-main-foreground text-sm">
      S&P 500: 4,782.31 (+0.54%)
    </div>
    <CollapsibleContent className="space-y-2 text-main-foreground font-base">
      <div className="rounded-base border-2 border-border bg-main px-4 py-3 font-mono text-sm">
        NASDAQ: 16,573.44 (+0.85%)
      </div>
      <div className="rounded-base border-2 border-border bg-main px-4 py-3 font-mono text-sm">
        VIX: 13.89 (-2.18%)
      </div>
    </CollapsibleContent>
  </Collapsible>
)
