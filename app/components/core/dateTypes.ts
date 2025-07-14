type TimeRange = {
    start : string | undefined, 
    end : string | undefined,
}

type Cost = {
    value? : number | undefined,
    currencyString : string;
}

type MapLocation = {
    address : string,
    label : string,
}