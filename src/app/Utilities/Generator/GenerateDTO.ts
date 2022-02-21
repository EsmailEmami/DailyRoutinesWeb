import {FilterActionsDTO} from '../../DTOs/Routine/FilterActionsDTO';
import {FilterCategoriesDTO} from "../../DTOs/Routine/FilterCategoriesDTO";
import {FilterRoutinesOrderByTypes} from "../Enums/FilterRoutinesOrderByTypes";
import {FilterUserLastActionsDTO} from "../../DTOs/Routine/FilterUserLastActions";
import {FilterUsersDTO} from "../../DTOs/Users/FilterUsersDTO";
import {FilterRolesDTO} from "../../DTOs/Access/FilterRolesDTO";

export class GenerateDTO {

  public static generateFilterCategoriesDTO(takeEntity: number, userId?: string): FilterCategoriesDTO {
    return new FilterCategoriesDTO(
      userId ? userId : '',
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

  public static generateFilterUsersDTO(takeEntity: number, type: string): FilterUsersDTO {
    return new FilterUsersDTO(
      '',
      type,
      [],
      1,
      0,
      0,
      0,
      takeEntity,
      0,
      1,
    );
  }

  public static generateFilterRolesDTO(takeEntity: number): FilterRolesDTO {
    return new FilterRolesDTO(
      '',
      [],
      1,
      0,
      0,
      0,
      takeEntity,
      0,
      1,
    );
  }
}
