<?php

namespace IP\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        $users = [
            ['name' => 'Toto'],
            ['name' => 'Arthur'],
        ];

        return $this->render('IPUserBundle:Default:index.html.twig', compact('name', 'users'));
    }
}
