import {FilterActionsDTO} from '../../DTOs/Routine/FilterActionsDTO';
import {FilterCategoriesDTO} from "../../DTOs/Routine/FilterCategoriesDTO";
import {FilterRoutinesOrderByTypes} from "../Enums/FilterRoutinesOrderByTypes";
import {FilterUserLastActionsDTO} from "../../DTOs/Routine/FilterUserLastActions";

export class GenerateDTO {

  public static generateFilterCategoriesDTO(takeEntity: number): FilterCategoriesDTO {
    return new FilterCategoriesDTO(
      '',
      '',
      FilterRoutinesOrderByTypes.UpdateDate,
      [],
      0,
      0,
      0,
      6,
      takeEntity,
      0,
      0
    );
  }

  public static generateFilterActionsDTO(categoryId: string, takeEntity: number): FilterActionsDTO {
    return new FilterActionsDTO(
      categoryId,
      '',
      0,
      0,
      0,
      [],
      0,
      0,
      0,
      6,
      takeEntity,
      0,
      0
    );
  }

  public static generateFilterUserLastActionsDTO(takeEntity: number, userId?: string): FilterUserLastActionsDTO {
    return new FilterUserLastActionsDTO(
      userId ? userId : '',
      '',
      0,
      0,
      0,
      [],
      0,
      0,
      0,
      6,
      takeEntity,
      0,
      0
    );
  }
}
