<?php
interface ICarta {
  public function agregarCarta($carta);
  public function obtenerCartas();
  public function nuevoId();
  public function obtenerCartasPorNombre($name);
  public function obtenerCartasPorCategoria($category);
  public function obtenerCartasPorSubexpansionId($subexpansion_id);
}
