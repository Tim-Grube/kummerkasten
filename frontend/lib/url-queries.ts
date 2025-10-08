import {TicketFiltering, TicketSorting, TicketSortingField} from "@/components/providers/ticket-provider";
import {ReadonlyURLSearchParams} from "next/navigation";
import {defaultTicketFiltering, defaultTicketSorting} from "@/lib/graph/defaultTypes";
import {arraysEqual} from "@/lib/utils";
import {TicketState} from "@/lib/graph/generated/graphql";

export const SEARCH_QUERY_KEY = 'search'
export const STATUS_QUERY_KEY = 'status';
export const LABELS_QUERY_KEY = 'labels';
export const START_QUERY_KEY = 'start';
export const END_QUERY_KEY = 'end'
export const SORT_FIELD_QUERY_KEY = 'sort';
export const SORT_ORDER_QUERY_KEY = 'ord';

const SEPARATOR = "+"

export function createTicketQueryString(sorting: TicketSorting, filtering: TicketFiltering): URLSearchParams {
  const params = new URLSearchParams()
  const {state, labels, searchTerm, startDate, endDate} = filtering
  const {field, orderAscending} = sorting
  const states = state?.map(s => s.toLowerCase()).join(SEPARATOR)
  const labelNames = labels?.map(l => l.name).join(SEPARATOR)

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
  const sortingFields: TicketSortingField[] = ["Erstellt", "Geändert", "Titel"]
  const paramField = params.get(SORT_FIELD_QUERY_KEY) as TicketSortingField
  const isSortingField = paramField && sortingFields.includes(paramField)

  const sorting: TicketSorting = {
    field: isSortingField ? paramField : defaultTicketSorting.field,
    orderAscending: params.get(SORT_ORDER_QUERY_KEY) !== 'desc'
  }

  return sorting
}

export function getTicketFilteringSearchTermFromSearchParams(params: ReadonlyURLSearchParams) {
  return params.get(SEARCH_QUERY_KEY) ?? ""
}

export function getTicketFilterinStatesFromSearchParams(params: ReadonlyURLSearchParams) {
  const paramStates = params.get(STATUS_QUERY_KEY)
  const states: TicketState[] = []

  if (!paramStates) return defaultTicketFiltering.state

  if (paramStates.toLowerCase().includes(TicketState.New.toLowerCase())) states.push(TicketState.New)
  if (paramStates.toLowerCase().includes(TicketState.Open.toLowerCase())) states.push(TicketState.Open)
  if (paramStates.toLowerCase().includes(TicketState.Closed.toLowerCase())) states.push(TicketState.Closed)
  return states
}

/** Returns the label names in lowercase */
export function getTicketFilteringLabelNamesFromSearchParams(params: ReadonlyURLSearchParams) {
  const paramLabelNames = params.get(LABELS_QUERY_KEY)
  return (paramLabelNames ?? "").split(SEPARATOR)
}

export function getTicketFilteringDateRangeFromSearchParams(params: ReadonlyURLSearchParams) {
  const paramStartDate = params.get(START_QUERY_KEY)
  const paramEndDate = params.get(END_QUERY_KEY)
  const startDate = paramStartDate ? new Date(paramStartDate) : null
  const endDate = paramEndDate ? new Date(paramEndDate) : null
  return {start: startDate, end: endDate}
}