package com.nationalpark.scout.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
public class Colonist {
  @Id
  @GeneratedValue(strategy=GenerationType.AUTO) 
  private Integer colonist_id;

  private String colonist_name;

  public Integer getId() {
    return colonist_id;
  }

  public void setId(Integer colonist_id) {
    this.colonist_id = colonist_id;
  }

  public String getName() {
    return colonist_name;
  }

  public void setName(String colonist_name) {
    this.colonist_name = colonist_name;
  }

}