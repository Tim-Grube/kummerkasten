import {TicketFiltering, TicketSorting, TicketSortingField} from "@/app/tickets/page";
import {ReadonlyURLSearchParams} from "next/navigation";
import {defaultTicketFiltering, defaultTicketSorting} from "@/lib/graph/defaultTypes";

export const SEARCH_QUERY_KEY = 'search'
export const STATUS_QUERY_KEY = 'status';
export const LABELS_QUERY_KEY = 'labels';
export const START_QUERY_KEY = 'start';
export const END_QUERY_KEY = 'end'
export const SORT_FIELD_QUERY_KEY = 'sort';
export const SORT_ORDER_QUERY_KEY = 'ord';

export function createTicketQueryString(sorting: TicketSorting, filtering: TicketFiltering): URLSearchParams {
  const params = new URLSearchParams()
  let states = ""
  filtering.state.forEach((state, i) => {
    if (i === 0) states += `${state.toLowerCase()}`
    else states += `+${state.toLowerCase()}`
  })

  let labels = ""
  filtering.labels.forEach((label, i) => {
    if (i === 0) labels += `${label.name}`
    else labels += `+${label.name}`
  })

  if (filtering.searchTerm !== "") params.set(SEARCH_QUERY_KEY, filtering.searchTerm)
  if (filtering.state.length > 0 && filtering.state != defaultTicketFiltering.state) params.set(STATUS_QUERY_KEY, states)
  if(filtering.labels.length > 0) params.set(LABELS_QUERY_KEY, labels)
  if (filtering.startDate) params.set(START_QUERY_KEY, filtering.startDate.toDateString())
  if (filtering.endDate) params.set(END_QUERY_KEY, filtering.endDate.toDateString())
  if(sorting.field && sorting.field != defaultTicketSorting.field) params.set(SORT_FIELD_QUERY_KEY, sorting.field)

  if (!sorting.orderAscending) params.set(SORT_ORDER_QUERY_KEY, 'desc')

  return params
}

export function getTicketSortingFromSearchParams(params: ReadonlyURLSearchParams) {
  console.log(params.get(SORT_ORDER_QUERY_KEY))
  const sorting: TicketSorting = {
    field: params.get(SORT_FIELD_QUERY_KEY) as TicketSortingField,
    orderAscending: params.get(SORT_ORDER_QUERY_KEY) !== 'desc'
  }

  return sorting
}