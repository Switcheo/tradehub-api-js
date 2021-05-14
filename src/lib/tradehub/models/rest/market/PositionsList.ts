import { Position } from "../history";

export interface PositionsList {
    current_page: string
    data: Array<Position>
    total_pages: string
}