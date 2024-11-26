<?php
interface IExpansions {
  public function obtenerExpansiones();
  public function obtenerCartasPorExpansion($name);
  public function crearExpansion($name);
}
