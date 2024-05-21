import { supabaseDB as supabase } from '../server.js';

export async function fetchData(table, columns) {
    const { data, error } = await supabase.from(table).select(columns);

    if (error) {
        console.error(error);
        return false;
    }
    return data;
}

export async function fetchDataFiltered(table, columns, filterColumn, filter) {
    const { data, error } = await supabase.from(table).select(columns).eq(filterColumn, filter);

    if (error) {
        console.error(error);
        return false;
    }
    return data;
}

export async function fetchDataCaseInsensitive(table, columns, filterColumn, filter) {
    const { data, error } = await supabase.from(table).select(columns).ilike(filterColumn, filter);

    if (error) {
        console.error(error);
        return false;
    }
    return data;
}

export async function insertData(table, items) {
    const { error } = await supabase.from(table).insert(items);

    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function updateData(table, items, column, filter) {
    const { error } = await supabase.from(table).update(items).eq(column, filter);

    if (error) {
        console.error(error);
        return false;
    }
    return true;
}
