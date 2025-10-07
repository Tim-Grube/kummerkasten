import {TicketFiltering, TicketSorting, TicketSortingField} from "@/components/providers/ticket-provider";
import {ReadonlyURLSearchParams} from "next/navigation";
import {defaultTicketFiltering, defaultTicketSorting} from "@/lib/graph/defaultTypes";
import {arraysEqual} from "@/lib/utils";

export const SEARCH_QUERY_KEY = 'search'
export const STATUS_QUERY_KEY = 'status';
export const LABELS_QUERY_KEY = 'labels';
export const START_QUERY_KEY = 'start';
export const END_QUERY_KEY = 'end'
export const SORT_FIELD_QUERY_KEY = 'sort';
export const SORT_ORDER_QUERY_KEY = 'ord';

export function createTicketQueryString(
  sorting: TicketSorting,
  filtering: TicketFiltering
): URLSearchParams {
  const params = new URLSearchParams()
  const {state, labels, searchTerm, startDate, endDate} = filtering
  const {field, orderAscending} = sorting
  const states = state?.map(s => s.toLowerCase()).join('+')
  const labelNames = labels?.map(l => l.name).join('+')

  if (searchTerm?.trim()) params.set(SEARCH_QUERY_KEY, searchTerm.trim())

  if (state?.length && !arraysEqual(state, defaultTicketFiltering.state)) {
    params.set(STATUS_QUERY_KEY, states)
  }

  if (labels?.length) {
    params.set(LABELS_QUERY_KEY, labelNames)
  }

  if (startDate) {
    params.set(START_QUERY_KEY, startDate.toISOString())
  }

  if (endDate) {
    params.set(END_QUERY_KEY, endDate.toISOString())
  }

  if (field && field !== defaultTicketSorting.field) {
    params.set(SORT_FIELD_QUERY_KEY, field)
  }

  if (!orderAscending) {
    params.set(SORT_ORDER_QUERY_KEY, 'desc')
  }

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