<?php
interface ICarta {
  public function obtenerCartas();
  public function obtenerCartasPorNombre($name);
  public function obtenerCartasPorCategoria($category);
  public function obtenerCartasPorExpancion($Expancion);
}
