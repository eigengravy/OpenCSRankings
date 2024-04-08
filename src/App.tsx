import { useEffect, useState } from "react";
import { cloneDeep, range } from "lodash";

import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NAMES, CONFS, CONF_NAMES, FAQ } from "./constants";
import { cn } from "./lib/utils";
import { ModeToggle } from "./components/ui/mode-toggle";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DataTable as FacultyDataTable,
  facultyColumns,
} from "./components/FacultyTable";

import {
  DataTable as InstituteDataTable,
  instituteColumns,
} from "./components/InstituteTable";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";

const getActiveAreas = (value: boolean) => {
  return {
    ai: {
      checked: value,
      children: {
        ml: { checked: value },
        ai: { checked: value },
        cv: { checked: value },
        nlp: { checked: value },
        web: { checked: value },
      },
    },
    systems: {
      checked: value,
      children: {
        arch: { checked: value },
        networks: { checked: value },
        security: { checked: value },
        db: { checked: value },
        eda: { checked: value },
        embedded: { checked: value },
        hpc: { checked: value },
        mobile: { checked: value },
        measurement: { checked: value },
        os: { checked: value },
        proglang: { checked: value },
        software: { checked: value },
      },
    },
    theory: {
      checked: value,
      children: {
        crypto: { checked: value },
        algo: { checked: value },
        logic: { checked: value },
      },
    },

    inter: {
      checked: value,
      children: {
        bio: { checked: value },
        graphics: { checked: value },
        edu: { checked: value },
        ecocomp: { checked: value },
        hci: { checked: value },
        robotics: { checked: value },
        visualisation: { checked: value },
      },
    },
  };
};
function App() {
  const [startYear, setStartYear] = useState(new Date().getFullYear() - 10);
  const [endYear, setEndYear] = useState(new Date().getFullYear());

  const [activeAreas, setActiveAreas] = useState<any>(getActiveAreas(true));

  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [dblp, setDblp] = useState<any[]>([]);
  const [activeConfs, setActiveConfs] = useState<any[]>([]);

  const [faculty, setFaculty] = useState<any>([]);
  const [institutes, setInstitutes] = useState<any>([]);

  useEffect(() => {
    setActiveConfs(
      Object.keys(activeAreas).flatMap((area) =>
        Object.keys(activeAreas[area].children).flatMap((subArea) =>
          activeAreas[area].children[subArea].checked
            ? CONFS[area][subArea]
            : []
        )
      )
    );
  }, [activeAreas]);

  useEffect(() => {
    setLoading(true);
    setLoadingProgress(0);
    (async () => {
      const affiliations = (
        await (await fetch(import.meta.env.VITE_AFFILIATIONS)).text()
      )
        .trim()
        .split("\n")
        .slice(1)
        .map((line) => line.split(","))
        .reduce((acc, [name, dept, homepage, scholar]) => {
          acc[name] = {
            dept,
            homepage,
            scholar,
          };
          return acc;
        }, {});

      setLoadingProgress(33);

      setDblp(
        (await (await fetch(import.meta.env.VITE_DBLP)).text())
          .trim()
          .split("\n")
          .slice(1)
          .map((line) => {
            const [name, dept, conf, count, adj, year] = line.split(",");
            return {
              name,
              dept,
              conf,
              count: parseInt(count),
              adj: parseFloat(adj),
              year: parseInt(year),
              homepage: affiliations[name]?.homepage,
              scholar: affiliations[name]?.scholar,
            };
          })
      );

      setLoadingProgress(67);
    })();
  }, []);

  useEffect(() => {
    if (dblp && dblp.length > 0) {
      const filteredDblp = dblp.filter(
        (entry) =>
          entry.year >= startYear &&
          entry.year <= endYear &&
          activeConfs.includes(entry.conf)
      );

      const sortedFaculty = Object.values(
        filteredDblp.reduce((acc, entry) => {
          if (!acc[entry.name]) {
            acc[entry.name] = {
              name: entry.name,
              dept: entry.dept,
              homepage: entry.homepage,
              scholar: entry.scholar,
              pubs: 0,
              adj: 0,
            };
          }
          acc[entry.name].pubs += entry.count;
          acc[entry.name].adj += entry.adj;
          return acc;
        }, {})
      ).sort((a: any, b: any) => b["adj"] - a["adj"]);

      const sortedInstitutes = Object.values(
        sortedFaculty.reduce((acc, entry) => {
          if (!acc[entry["dept"]]) {
            acc[entry["dept"]] = {
              name: entry["dept"],
              people: [],
              size: 0,
              pubs: 0,
              adj: 0,
            };
          }
          acc[entry["dept"]].people.push(entry);
          acc[entry["dept"]].size += 1;
          acc[entry["dept"]].pubs += entry["pubs"];
          acc[entry["dept"]].adj += entry["adj"];
          return acc;
        }, {})
      ).sort((a: any, b: any) => b["adj"] - a["adj"]);

      setFaculty(sortedFaculty);
      setInstitutes(sortedInstitutes);
      setLoadingProgress(99);
      setLoading(false);
    }
  }, [dblp, startYear, endYear, activeConfs]);

  return (
    <>
      <div className="px-5 lg:px-16 pt-5 w-full min-h-[95vh] flex flex-col lg:flex-row">
        {loading && (
          <div className="flex justify-center items-center w-full h-[100vh]">
            <Progress className="w-[60%]" value={loadingProgress}></Progress>
          </div>
        )}
        {!loading && (
          <>
            <div className="flex flex-col w-full lg:w-4/12 p-2 gap-3">
              <div className="text-3xl">OpenCSRankings</div>

              <p className="h-19">
                Metrics-based ranking of top CS institutions and faculty in
                India.
              </p>
              <div className="mt-3">
                <Card className={cn("w-[75vh")}>
                  <CardHeader>
                    <CardTitle
                      className={cn(
                        "flex flex-row justify-between items-center"
                      )}
                    >
                      Settings
                      <div className="flex flex-row gap-3">
                        <ModeToggle />
                        <Drawer>
                          <DrawerTrigger>
                            <Button variant="outline">FAQ</Button>
                          </DrawerTrigger>
                          <DrawerContent>
                            <div className="w-full mx-auto max-w-3xl">
                              <DrawerHeader>
                                <DrawerTitle>FAQ</DrawerTitle>
                                <DrawerDescription>
                                  Frequently Asked Questions for OpenCSRanking
                                </DrawerDescription>
                              </DrawerHeader>
                              <DrawerFooter>
                                <ScrollArea className="h-[50vh] px-5 py-3 mb-1 rounded-md border">
                                  {FAQ.map(({ q, a }) => (
                                    <>
                                      <p className="font-bold text-lg">{q}</p>
                                      <p className="text-sm">{a}</p>
                                    </>
                                  ))}
                                </ScrollArea>
                              </DrawerFooter>
                            </div>
                          </DrawerContent>
                        </Drawer>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={cn("flex flex-col gap-5")}>
                    <div className="flex flex-row gap-3 items-center">
                      <Select
                        value={startYear.toString()}
                        onValueChange={(e) => setStartYear(parseInt(e))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={startYear} />
                        </SelectTrigger>
                        <SelectContent>
                          {range(1970, new Date().getFullYear() + 1).map(
                            (year) => (
                              <SelectItem value={year.toString()}>
                                {year}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <p className="text-sm">to</p>
                      <Select
                        value={endYear.toString()}
                        onValueChange={(e) => setEndYear(parseInt(e))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={endYear} />
                        </SelectTrigger>
                        <SelectContent>
                          {range(1980, new Date().getFullYear() + 1).map(
                            (year) => (
                              <SelectItem value={year.toString()}>
                                {year}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row justify-between items-center text-xl">
                        Domains
                        <div className="flex flex-row gap-3 items-center">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setActiveAreas(getActiveAreas(true));
                            }}
                          >
                            All
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setActiveAreas(getActiveAreas(false));
                            }}
                          >
                            None
                          </Button>
                        </div>
                      </div>
                      <ScrollArea className="h-[20vh] lg:h-[46vh] px-3 mb-1 rounded-md border">
                        {Object.keys(activeAreas).map((area) => (
                          <div key={area} className="py-1">
                            <div className="flex flex-row items-center gap-2">
                              <Checkbox
                                checked={activeAreas[area].checked}
                                onCheckedChange={(e) => {
                                  const currActiveAreas =
                                    cloneDeep(activeAreas);
                                  currActiveAreas[area].checked = e;
                                  Object.keys(
                                    currActiveAreas[area].children
                                  ).forEach((subArea) => {
                                    currActiveAreas[area].children[
                                      subArea
                                    ].checked = e;
                                  });
                                  setActiveAreas(currActiveAreas);
                                }}
                              />
                              <p className="text-lg">{NAMES[area]}</p>
                            </div>
                            <Separator className="my-1  " />
                            <div className="flex flex-col gap-2 ml-4">
                              {Object.keys(activeAreas[area].children).map(
                                (subArea) => {
                                  return (
                                    <HoverCard openDelay={200} closeDelay={50}>
                                      <HoverCardTrigger>
                                        <div
                                          key={subArea}
                                          className="flex flex-row items-center gap-2"
                                        >
                                          <Checkbox
                                            checked={
                                              activeAreas[area].children[
                                                subArea
                                              ].checked
                                            }
                                            onCheckedChange={(e) => {
                                              const currActiveAreas =
                                                cloneDeep(activeAreas);
                                              currActiveAreas[area].children[
                                                subArea
                                              ].checked = e;
                                              currActiveAreas[area].checked =
                                                Object.keys(
                                                  currActiveAreas[area].children
                                                ).reduce((acc, subArea) => {
                                                  return (
                                                    acc &&
                                                    currActiveAreas[area]
                                                      .children[subArea].checked
                                                  );
                                                }, true);
                                              setActiveAreas(currActiveAreas);
                                            }}
                                          />
                                          <p className="text-sm">
                                            {NAMES[subArea]}
                                          </p>
                                        </div>
                                      </HoverCardTrigger>
                                      <HoverCardContent>
                                        <p className="text-xs">
                                          {CONFS[area][subArea]
                                            .map(
                                              (conf: string) => CONF_NAMES[conf]
                                            )
                                            .join(", ")}
                                        </p>
                                      </HoverCardContent>
                                    </HoverCard>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex flex-col w-full lg:w-8/12 p-2">
              <Tabs defaultValue="institute" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="institute" className="w-full">
                    Institute ({institutes.length})
                  </TabsTrigger>
                  <TabsTrigger value="faculty" className="w-full">
                    Faculty ({faculty.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="institute">
                  <InstituteDataTable
                    columns={instituteColumns}
                    data={institutes}
                  />
                </TabsContent>
                <TabsContent value="faculty">
                  <FacultyDataTable columns={facultyColumns} data={faculty} />
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
      {!loading && (
        <footer className="w-full text-sm text-center pb-2 pt-2">
          © {new Date().getFullYear()},{" "}
          <a className="underline" href="https://github.com/eigengravy">
            OpenCSRankings
          </a>
          . Made with ❤️ in 🇮🇳.
        </footer>
      )}
    </>
  );
}

export default App;
