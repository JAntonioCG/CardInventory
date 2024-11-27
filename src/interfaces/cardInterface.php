<?php
interface ICarta {
  public function agregarCarta($carta);
  public function obtenerCartas();
  public function obtenerCartasPorNombre($name);
  public function obtenerCartasPorCategoria($category);
  public function obtenerCartasPorSubexpansion($subexpansion_id);
}
