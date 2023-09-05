export interface SortablePage {
    sortOrder?: 'asc' | 'desc'
    sortColumn?: string
    page?: number
    search?: string
    filter?: 'daily' | 'weekly' | 'monthly' | 'yearly'
    limit?: number
}