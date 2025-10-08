import React, {useEffect, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Command, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {TicketState} from "@/lib/graph/generated/graphql";
import {Check} from "lucide-react";
import LabelSelection from "@/components/label-selection";
import {DateRangeFilter} from "@/components/date-range-filter";
import SortingSelection from "@/app/tickets/sorting-selection";
import {useLabels} from "@/components/providers/label-provider";
import {useTickets} from "@/components/providers/ticket-provider";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {
  createTicketQueryString,
  getTicketFilteringDateRangeFromSearchParams,
  getTicketFilteringLabelNamesFromSearchParams,
  getTicketFilteringSearchTermFromSearchParams,
  getTicketFilterinStatesFromSearchParams, getTicketSortingFromSearchParams
} from "@/lib/url-queries";

interface FilterBarProps {
  scrollable?: boolean;
}

export default function FilterBar({scrollable = false}: FilterBarProps) {
  const {labels} = useLabels()
  const {filtering, stateFilterSet, sorting, setSorting, setFiltering} = useTickets()
  const pathname = usePathname()
  const params = useSearchParams()
  const router = useRouter()
  const [hasInitializedFromParams, setHasInitializedFromParams] = useState<boolean>(false)

  // builds query string on change
  useEffect(() => {
    if (!hasInitializedFromParams) return;

    const searchParams = createTicketQueryString(sorting, filtering)
    if (searchParams.toString() === params.toString()) return;

    router.push(pathname + '?' + searchParams)
  }, [filtering.state.length, filtering.labels.length, filtering.startDate, filtering.endDate, sorting.field, sorting.orderAscending]);

  // initializs filtering from params
  useEffect(() => {
    if (hasInitializedFromParams || !params || labels.length === 0) return

    setFiltering({
      searchTerm: getTicketFilteringSearchTermFromSearchParams(params),
      state: getTicketFilterinStatesFromSearchParams(params),
      labels: labels.filter(label =>
        getTicketFilteringLabelNamesFromSearchParams(params).includes(label.name.toLowerCase())
      ),
      startDate: getTicketFilteringDateRangeFromSearchParams(params).start,
      endDate: getTicketFilteringDateRangeFromSearchParams(params).end
    })

    setSorting(getTicketSortingFromSearchParams(params))

    setHasInitializedFromParams(true)
  }, [params, hasInitializedFromParams, labels.length]);

  return (
    <div
      className={cn("flex gap-2", scrollable && "overflow-x-auto max-w-full h-13")}
      data-cy={'ticket-filter-bar'}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'max-w-[200px] justify-between',
              stateFilterSet && 'border !border-accent'
            )}
            data-cy="desktop-overview-button-status"
          >
            {filtering.state.length > 0
              ? `${filtering.state.length} Status`
              : "Status"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[170px]">
          <Command>
            <CommandInput placeholder="Status suchen..." data-cy={'desktop-overview-status-search'}/>
            <CommandGroup>
              {Object.values(TicketState).map((state) => {
                const isSelected = filtering.state.includes(state);
                return (
                  <CommandItem
                    key={state}
                    onSelect={() => {
                      setFiltering(prev => ({
                        ...prev,
                        state: isSelected
                          ? prev.state.filter((s) => s !== state)
                          : [...(prev.state), state]
                      }))
                    }}
                    data-cy={`desktop-overview-button-${state}`}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {state === TicketState.New
                      ? "Neu"
                      : state === TicketState.Open
                        ? "Offen"
                        : "Fertig"}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "max-w-[200px] justify-between",
              filtering.labels.length > 0 && 'border !border-accent'
            )}
            data-cy="desktop-overview-button-label">
            {filtering.labels.length > 0
              ? `${filtering.labels.length} Labels`
              : "Labels"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 max-w-[200px]">
          <LabelSelection
            labels={labels}
            selectedLabels={filtering.labels}
            setLabels={(labels) => setFiltering(prev => ({
              ...prev,
              labels: labels,
            }))}
          />
        </PopoverContent>
      </Popover>
      <DateRangeFilter
        startDate={filtering.startDate}
        setStartDate={(date) => setFiltering(prev => ({...prev, startDate: date}))}
        endDate={filtering.endDate}
        setEndDate={(date) => setFiltering(prev => ({...prev, endDate: date}))}
      />
      <SortingSelection/>
    </div>
  )
}